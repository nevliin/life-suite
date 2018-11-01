import {Injectable} from '@angular/core';
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {ErrorHandlingService} from "../core/error-handling/error-handling.service";
import {FinTransaction} from "./fin-transaction";
import {FinAccount} from "./fin-account";

@Injectable({
    providedIn: 'root'
})
export class FinService {

    accountsById: Map<number, FinAccount> | undefined;

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
                            return transaction;
                        })
                })
            ).toPromise().catch((e) => {
                this.errorHandlingService.handleHTTPError(e);
                return [];
            });
    }

    async getAccounts(): Promise<Map<number, FinAccount>> {
        if (this.accountsById === undefined) {
            console.log('getting accounts');
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
        }
        return this.accountsById;
    }

    async getAccountById(id: number): Promise<FinAccount> {
        await this.getAccounts();
        return this.accountsById.get(id);
    }

}
