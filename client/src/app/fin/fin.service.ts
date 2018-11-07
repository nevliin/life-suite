import {Injectable} from '@angular/core';
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {ErrorHandlingService} from "../core/error-handling/error-handling.service";
import {FinTransaction} from "./fin-transaction";
import {FinAccount} from "./fin-account";
import {FinCategory} from "./fin-category";

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

    async getRecentTransactions(): Promise<FinTransaction[]> {
        return await this.http.post('/api/fin/transaction/list', {
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

    async getAccounts(): Promise<FinAccount[]> {
        await this.getAccountsById();
        return Array.from(this.accountsById.values());
    }

    async getAccountsById(): Promise<Map<number, FinAccount>> {
        if (this.accountsById !== undefined) {
            return this.accountsById;
        }
        if (this.accountsPromise !== undefined) {
            await this.accountsPromise;
            return this.accountsById;
        }
        if (this.accountsById === undefined) {
            let resolveFunc: Function;
            this.accountsPromise = new Promise(resolve => {
                resolveFunc = resolve;
            });
            const accounts: FinAccount[] = await this.http.get('/api/fin/account/list')
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
        return ((await this.http.post('/api/fin/transaction/create/', transaction).toPromise().catch(e => {
            console.log(e);
            throw e;
        })) as any).id;
    }

    async createAccount(account: FinAccount): Promise<number> {
        return ((await this.http.post('/api/fin/account/create/', account).toPromise().catch(e => {
            console.log(e);
            throw e;
        })) as any).id;
    }

    async deleteAccount(accountId: number): Promise<number> {
        return ((await this.http.delete('/api/fin/account/delete/' + accountId).toPromise().catch(e => {
            console.log(e);
            throw e;
        })) as any).id;
    }

    async createCategory(category: FinCategory): Promise<number> {
        return ((await this.http.post('/api/fin/category/create/', category).toPromise().catch(e => {
            console.log(e);
            throw e;
        })) as any).id;
    }

    async getCategories(): Promise<FinCategory[]> {
        return ((await this.http.get('/api/fin/category/list').toPromise()) as any).data;
    }

    async deleteCategory(categoryId: number): Promise<number> {
        return ((await this.http.delete('/api/fin/category/delete/' + categoryId).toPromise().catch(e => {
            console.log(e);
            throw e;
        })) as any).id;
    }

}
