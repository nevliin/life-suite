import {Component, OnInit} from '@angular/core';
import {FinAccount} from "../fin-account";
import {ActivatedRoute} from "@angular/router";
import {FinService} from "../fin.service";
import {FinTransaction} from "../fin-transaction";
import {FinCategory} from "../fin-category";
import {FinTransactionEditComponent} from "../fin-transaction-edit/fin-transaction-edit.component";
import {MatDialog} from "@angular/material";

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

    displayTransactionsFrom: Date;

    maxDate = new Date();
    minDate = new Date(2018, 10, 1);

    account: FinAccount = null;
    accountTransactions: TransactionListRow[] = null;
    category: FinCategory = null;
    accountBalance: number = null;
    initialBalance: number = null;
    debitSum: number = null;
    creditSum: number = null;

    accountsById: Map<number, FinAccount> = new Map();

    constructor(
        private readonly route: ActivatedRoute,
        private readonly finService: FinService,
        private readonly dialog: MatDialog
    ) {
        this.locale = navigator.language;
        this.displayTransactionsFrom = new Date();
        this.displayTransactionsFrom.setMonth(this.displayTransactionsFrom.getMonth() - 1);
    }

    async ngOnInit() {
        this.route.paramMap.subscribe(async (paramMap) => {
            const accountId: number = Number.parseInt(paramMap.get('accountId'));
            this.accountsById = await this.finService.getAccountsById();
            this.account = this.accountsById.get(accountId);
            this.category = await this.finService.getCategory(this.account.category_id);
            await this.displayTransactions();
        });
    }

    async displayTransactions() {
        this.accountTransactions = await this.getAccountTransactions(this.account.id, this.displayTransactionsFrom);
        this.accountBalance = await this.finService.getAccountBalance(this.account.id);
        this.initialBalance = this.calcInitialBalance(this.accountBalance, this.accountTransactions);
        this.debitSum = this.calcDebitSum(this.initialBalance, this.accountTransactions);
        this.creditSum = this.calcCreditSum(this.initialBalance, this.accountTransactions);

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

    async openTransaction(transaction: FinTransaction) {
        this.dialog.open(FinTransactionEditComponent, {
            data: {transactionId: transaction.id, transaction: transaction},
            panelClass: 'mat-card-dialog-container'
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
        accountTransactions: TransactionListRow[]
    ): number {
        let debitSum: number = 0;
        let creditSum: number = 0;
        accountTransactions.forEach((value: TransactionListRow) => {
            if (value.debitTransaction && !value.debitTransaction.childAccount) {
                debitSum += value.debitTransaction.transaction.amount;
            }
            if (value.creditTransaction && !value.creditTransaction.childAccount) {
                creditSum += value.creditTransaction.transaction.amount;
            }
        });

        return accountBalance - debitSum + creditSum;
    }

    calcDebitSum(
        initialBalance: number,
        accountTransactions: TransactionListRow[]
    ): number {
        let sum: number = 0;
        accountTransactions.forEach((value: TransactionListRow) => {
            if (value.debitTransaction && !value.debitTransaction.childAccount) {
                sum += value.debitTransaction.transaction.amount;
            }
        });
        if (initialBalance >= 0) {
            sum += initialBalance;
        }
        return sum;
    }

    calcCreditSum(
        initialBalance: number,
        accountTransactions: TransactionListRow[]
    ) {
        let sum: number = 0;
        accountTransactions.forEach((value: TransactionListRow) => {
            if (value.creditTransaction && !value.creditTransaction.childAccount) {
                sum += value.creditTransaction.transaction.amount;
            }
        });
        if (initialBalance < 0) {
            sum += initialBalance;
        }
        return sum;
    }

}
