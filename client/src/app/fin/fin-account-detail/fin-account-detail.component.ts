import {Component, OnInit} from '@angular/core';
import {FinAccount} from "../fin-account";
import {ActivatedRoute} from "@angular/router";
import {FinService} from "../fin.service";
import {FinTransaction} from "../fin-transaction";
import {FinCategory} from "../fin-category";

export interface TransactionListRow {
    creditTransaction?: DisplayTransaction;
    debitTransaction?: DisplayTransaction;
}

export interface DisplayTransaction {
    transaction: FinTransaction;
    childAccount?: boolean;
}

@Component({
    selector: 'app-fin-account-detail',
    templateUrl: './fin-account-detail.component.html',
    styleUrls: ['./fin-account-detail.component.css']
})
export class FinAccountDetailComponent implements OnInit {
    locale: string = "en";

    account: FinAccount = null;
    accountTransactions: TransactionListRow[] = null;
    category: FinCategory = null;
    accountBalance: number = null;
    initialBalance: number = null;

    accountsById: Map<number, FinAccount> = new Map();

    constructor(
        private readonly route: ActivatedRoute,
        private readonly finService: FinService
    ) {
        this.locale = navigator.language;
    }

    async ngOnInit() {
        this.route.paramMap.subscribe(async (paramMap) => {
            const accountId: number = Number.parseInt(paramMap.get('accountId'));
            this.accountsById = await this.finService.getAccountsById();
            this.account = this.accountsById.get(accountId);
            this.category = await this.finService.getCategory(this.account.category_id);
            const from: Date = new Date();
            from.setMonth(from.getMonth() - 1);
            this.accountTransactions = await this.getAccountTransactions(accountId, from);
            this.accountBalance = await this.finService.getAccountBalance(accountId);
            this.initialBalance = this.calcInitialBalance(this.accountBalance, this.accountTransactions, this.category.active);
            console.log(this.accountBalance, this.initialBalance);
        });
    }

    async getAccountTransactions(id: number, from?: Date, to?: Date): Promise<TransactionListRow[]> {
        return (await this.finService.getTransactionsByAccount(id, from, to))
            .map((value: FinTransaction) => {
                const result: TransactionListRow = {};
                if (value.contra_account !== id) {
                    result.debitTransaction = {transaction: value};
                    if (this.isAccountParent(value.contra_account, id, this.accountsById)) {
                        result.debitTransaction.childAccount = true;
                    }
                }
                if (value.account !== id) {
                    result.creditTransaction = {transaction: value};
                    if (this.isAccountParent(value.account, id, this.accountsById)) {
                        result.creditTransaction.childAccount = true;
                    }
                }
                return result;
            });
    }

    isAccountParent(accountId: number, possibleParentId: number, accountsById: Map<number, FinAccount>): boolean {
        let currentId: number = accountId;
        while (true) {
            if (currentId === possibleParentId) {
                return true;
            }
            if (currentId === null) {
                return false;
            }
            currentId = accountsById.get(currentId).parent_account;
        }
    }

    calcInitialBalance(
        accountBalance: number,
        accountTransactions: TransactionListRow[],
        active: boolean
    ): number {
        let debitSum: number = 0;
        let creditSum: number = 0;
        accountTransactions.forEach((value: TransactionListRow) => {
            if(value.debitTransaction && !value.debitTransaction.childAccount) {
                debitSum += value.debitTransaction.transaction.amount;
            }
            if(value.creditTransaction && !value.creditTransaction.childAccount) {
                creditSum += value.creditTransaction.transaction.amount;
            }
        });
        debugger;

        if(active) {
            return accountBalance - debitSum + creditSum;
        } else {
            return accountBalance + debitSum - creditSum;
        }
    }

}
