import {Injectable} from '@angular/core';
import {map, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ErrorHandlingService} from '../core/error-handling/error-handling.service';
import {FinTransaction} from './fin-transaction';
import {FinAccount} from './fin-account';
import {FinCategory} from './fin-category';
import {Observable} from 'rxjs';

const API_ROOT: string = '/api/fin/';

export interface AccountBalance {
    id: number;
    name: string;
    balance: number;
}

@Injectable({
    providedIn: 'root'
})
export class FinService {

    constructor(
        readonly http: HttpClient,
        readonly errorHandlingService: ErrorHandlingService
    ) {
    }

    accountsById: Map<number, FinAccount> | undefined;
    accountsPromise: Promise<void>;

    static extractDate(date: Date | string): string {
        if (date instanceof Date) {
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        } else {
            return date.split('T')[0];
        }
    }

    async getAccountBalance(accountId: number, year?: number): Promise<number> {
        const options: any = {
            accountId: accountId.toString()
        };
        year ? options.from = year.toString() : null;
        return await this.http.get(API_ROOT + 'accountBalance', {
            params: options
        }).pipe(map((response: any) => Number.parseFloat(response.data.amount))).toPromise().catch((e) => {
            this.errorHandlingService.handleHTTPError(e);
            return null;
        });
    }

    getAccountBalancesByCategory(categoryId: number, from?: Date, to?: Date): Observable<AccountBalance[]> {
        const options: any = {
            categoryId: categoryId.toString()
        };
        from ? options.from = from.toISOString() : null;
        to ? options.to = to.toISOString() : null;
        return this.http.get(API_ROOT + 'accountBalancesByCategory', {
            params: options
        }).pipe(map((response: any) => response.data.balances));
    }

    async getCategoryTotal(categoryId: number, from?: Date, to?: Date): Promise<number> {
        return await this.http.post(API_ROOT + 'getCategoryTotal', {
            categoryId: categoryId,
            from: from,
            to: to
        }).pipe(map((res: any) => res.data.amount)).toPromise().catch((e) => {
            this.errorHandlingService.handleHTTPError(e);
            return [];
        });
    }

    async getAllTransactionsAmount(from?: Date, to?: Date): Promise<number> {
        return await this.http.post(API_ROOT + 'getAllTransactionsAmount', {
            from: from.toLocaleString('UTC'),
            to: to
        }).pipe(map((res: any) => res.data.amount)).toPromise().catch((e) => {
            this.errorHandlingService.handleHTTPError(e);
            return [];
        });
    }

    async getRecentTransactions(): Promise<FinTransaction[]> {
        return await this.http.post(API_ROOT + 'transaction/list', {
            limit: 50,
            orderField: 'executed_on',
            orderDirection: 'desc'
        })
            .pipe(map((response: { data: FinTransaction[] }) => {
                    return response.data
                        .map((transaction: FinTransaction) => {
                            transaction.executed_on = new Date(transaction.executed_on);
                            transaction.created_on = new Date(transaction.created_on);
                            return transaction;
                        });
                })
            ).toPromise().catch((e) => {
                this.errorHandlingService.handleHTTPError(e);
                return [];
            });
    }

    async getRecentlyUsedAccounts(): Promise<FinAccount[]> {
        return await this.http.get(API_ROOT + 'recentlyUsedAccounts')
            .pipe(map((response: { data: FinAccount[] }) => {
                    return response.data
                        .map((account: FinAccount) => {
                            account.created_on = new Date(account.created_on);
                            return account;
                        });
                })
            ).toPromise().catch((e) => {
                this.errorHandlingService.handleHTTPError(e);
                return [];
            });
    }

    async getTransaction(transactionId: number): Promise<FinTransaction> {
        return await this.http.get(API_ROOT + 'transaction/read/' + transactionId)
            .pipe(map((response: { data: FinTransaction }) => {
                    response.data.created_on = new Date(response.data.created_on);
                    response.data.executed_on = new Date(response.data.executed_on);
                    return response.data;
                }
            )).toPromise().catch((e) => {
                this.errorHandlingService.handleHTTPError(e);
                return new FinTransaction();
            });
    }

    async getTransactionsByAccount(accountId: number, from?: Date, to?: Date, limit?: number): Promise<FinTransaction[]> {
        const options: any = {
            accountId: accountId.toString()
        };
        from ? options.from = FinService.extractDate(from) : null;
        to ? options.to = FinService.extractDate(to) : null;
        limit ? options.limit = limit.toString() : null;
        return await this.http.get(API_ROOT + 'transactionsByAccount', {
            params: options
        })
            .pipe(
                map((response: { data: FinTransaction[] }) => {
                        return response.data
                            .map(value => {
                                value.created_on = new Date(value.created_on);
                                value.executed_on = new Date(value.executed_on);
                                value.amount = Number.parseFloat(<string><unknown>value.amount);
                                return value;
                            })
                            .sort((a: FinTransaction, b: FinTransaction) =>
                                a.created_on.getTime() - b.created_on.getTime()
                            );
                    }
                )).toPromise().catch((e) => {
                this.errorHandlingService.handleHTTPError(e);
                return [];
            });
    }

    async getAccounts(): Promise<FinAccount[]> {
        await this.getAccountsById();
        return Array.from(this.accountsById.values());
    }

    async getAccountsById(forceReload?: boolean): Promise<Map<number, FinAccount>> {
        if (this.accountsById !== undefined && !forceReload) {
            return this.accountsById;
        }
        if (this.accountsPromise !== undefined && !forceReload) {
            await this.accountsPromise;
            return this.accountsById;
        }
        if (this.accountsById === undefined || forceReload) {
            let resolveFunc: Function;
            this.accountsPromise = new Promise(resolve => {
                resolveFunc = resolve;
            });
            const accounts: FinAccount[] = await this.http.get(API_ROOT + 'account/list')
                .pipe(map((response: { data: FinAccount[] }) => {
                        return response.data
                            .map((account: FinAccount) => {
                                account.created_on = new Date(account.created_on);
                                return account;
                            });
                    })
                ).toPromise().catch((e) => {
                    this.errorHandlingService.handleHTTPError(e);
                    return [];
                });
            const accountsById: Map<number, FinAccount> = new Map<number, FinAccount>();
            accounts.forEach((account: FinAccount) => {
                accountsById.set(account.id, account);
            });
            this.accountsById = accountsById;
            resolveFunc();
        }
        return this.accountsById;
    }

    async getAccountById(id: number): Promise<FinAccount> {
        await this.getAccountsById();
        return this.accountsById.get(id);
    }

    async createTransaction(transaction: FinTransaction): Promise<number> {
        return ((await this.http.post(API_ROOT + 'transaction/create/', transaction).toPromise().catch(e => {
            console.log(e);
            throw e;
        })) as any).id;
    }

    async updateTransaction(transaction: FinTransaction): Promise<number> {
        return ((await this.http.put(API_ROOT + 'transaction/update/', {data: transaction}).toPromise().catch(e => {
            console.log(e);
            throw e;
        })) as any).id;
    }

    async deleteTransaction(transactionId: number): Promise<number> {
        return ((await this.http.delete(API_ROOT + 'transaction/delete/' + transactionId).toPromise().catch(e => {
            console.log(e);
            throw e;
        })) as any).id;
    }

    async createAccount(account: FinAccount): Promise<number> {
        return ((await this.http.post(API_ROOT + 'account/create/', account)
            .pipe(tap(() => this.getAccountsById(true))).toPromise().catch(e => {
                console.log(e);
                throw e;
            })) as any).id;
    }

    async updateAccount(account: FinAccount, oldId?: number): Promise<number> {
        return ((await this.http.put(API_ROOT + 'account/update/', {
            data: account,
            oldId: oldId
        }).pipe(tap(() => this.getAccountsById(true))).toPromise().catch(e => {
            console.log(e);
            throw e;
        })) as any).id;
    }

    async deleteAccount(accountId: number): Promise<number> {
        return ((await this.http.delete(API_ROOT + 'account/delete/' + accountId)
            .pipe(tap(() => this.getAccountsById(true))).toPromise().catch(e => {
                console.log(e);
                throw e;
            })) as any).id;
    }

    async createCategory(category: FinCategory): Promise<number> {
        return ((await this.http.post(API_ROOT + 'category/create/', category).toPromise().catch(e => {
            console.log(e);
            throw e;
        })) as any).id;
    }

    async getCategories(): Promise<FinCategory[]> {
        return ((await this.http.get(API_ROOT + 'category/list').toPromise()) as any).data;
    }

    async getCategory(categoryId: number): Promise<FinCategory> {
        return ((await this.http.get(API_ROOT + 'category/read/' + categoryId).toPromise()) as any).data;
    }

    async updateCategory(category: FinCategory): Promise<number> {
        return ((await this.http.put(API_ROOT + 'category/update/', {data: category}).toPromise().catch(e => {
            console.log(e);
            throw e;
        })) as any).id;
    }

    async deleteCategory(categoryId: number): Promise<number> {
        return ((await this.http.delete(API_ROOT + 'category/delete/' + categoryId)
            .pipe(tap(() => this.getAccountsById(true))).toPromise().catch(e => {
                console.log(e);
                throw e;
            })) as any).id;
    }
}
