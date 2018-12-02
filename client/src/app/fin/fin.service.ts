import {Injectable} from '@angular/core';
import {map, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {ErrorHandlingService} from "../core/error-handling/error-handling.service";
import {FinTransaction} from "./fin-transaction";
import {FinAccount} from "./fin-account";
import {FinCategory} from "./fin-category";

const API_ROOT: string = '/api/fin/';

@Injectable({
    providedIn: 'root'
})
export class FinService {

    accountsById: Map<number, FinAccount> | undefined;
    accountsPromise: Promise<void>;

    constructor(
        readonly http: HttpClient,
        readonly errorHandlingService: ErrorHandlingService
    ) {
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
            orderField: "executed_on",
            orderDirection: "desc"
        })
            .pipe(map((response: { data: FinTransaction[] }) => {
                    return response.data
                        .map((transaction: FinTransaction) => {
                            transaction.executed_on = new Date(transaction.executed_on);
                            transaction.created_on = new Date(transaction.created_on);
                            return transaction;
                        })
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
                    return response.data!;
                }
            )).toPromise().catch((e) => {
                this.errorHandlingService.handleHTTPError(e);
                return new FinTransaction();
            })
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
                            })
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

    async createAccount(account: FinAccount): Promise<number> {
        return ((await this.http.post(API_ROOT + 'account/create/', account).pipe(tap(() => this.getAccountsById(true))).toPromise().catch(e => {
            console.log(e);
            throw e;
        })) as any).id;
    }

    async updateAccount(account: FinAccount, oldId?: number): Promise<number> {
        return ((await this.http.put(API_ROOT + 'account/update/', { data: account, oldId: oldId }).pipe(tap(() => this.getAccountsById(true))).toPromise().catch(e => {
            console.log(e);
            throw e;
        })) as any).id;
    }

    async deleteAccount(accountId: number): Promise<number> {
        return ((await this.http.delete(API_ROOT + 'account/delete/' + accountId).pipe(tap(() => this.getAccountsById(true))).toPromise().catch(e => {
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

    async updateCategory(category: FinCategory): Promise<number> {
        return ((await this.http.put(API_ROOT + 'category/update/', { data: category}).toPromise().catch(e => {
            console.log(e);
            throw e;
        })) as any).id;
    }

    async deleteCategory(categoryId: number): Promise<number> {
        return ((await this.http.delete(API_ROOT + 'category/delete/' + categoryId).pipe(tap(() => this.getAccountsById(true))).toPromise().catch(e => {
            console.log(e);
            throw e;
        })) as any).id;
    }
}
