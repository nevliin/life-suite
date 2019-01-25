import {Component, OnInit} from '@angular/core';
import {FinService} from '../fin.service';
import {FinTransaction} from '../fin-transaction';
import {ErrorHandlingService} from '../../core/error-handling/error-handling.service';
import {MatDialog} from '@angular/material';
import {FinTransactionEditComponent} from '../fin-transaction-edit/fin-transaction-edit.component';

@Component({
    selector: 'app-fin-recent',
    templateUrl: './fin-recent.component.html',
    styleUrls: ['./fin-recent.component.css']
})
export class FinRecentComponent implements OnInit {

    recentTransactions: FinTransactionDisplay[] = [];

    constructor(
        readonly finService: FinService,
        readonly errorHandlingService: ErrorHandlingService,
        private readonly dialog: MatDialog
    ) {
    }

    async ngOnInit() {
        const tempArray: FinTransaction[] = await this.finService.getRecentTransactions();
        for (const transaction of tempArray) {
            this.recentTransactions.push(new FinTransactionDisplay(
                transaction,
                (await this.finService.getAccountById(transaction.account)).name,
                (await this.finService.getAccountById(transaction.contra_account)).name)
            );
        }
        this.recentTransactions
            .sort((a: FinTransactionDisplay, b: FinTransactionDisplay) => b.created_on.getTime() - a.created_on.getTime());
    }

    async deleteTransaction(id: number) {
        try {
            await this.finService.deleteTransaction(id);
            const index: number = this.recentTransactions.findIndex((value: FinTransactionDisplay) => value.id === id);
            if (index !== -1) {
                this.recentTransactions.splice(index, 1);
            }
        } catch (e) {
            this.errorHandlingService.handleHTTPError(e);
        }
    }

    async openTransaction(id: number) {
        this.dialog.open(FinTransactionEditComponent, {
            data: {transactionId: id},
            panelClass: 'mat-card-dialog-container'
        });
    }

}

class FinTransactionDisplay extends FinTransaction {
    accountName: string;
    contraAccountName: string;

    constructor(transaction: FinTransaction, accountName: string, contraAccountName: string) {
        super();
        this.note = transaction.note;
        this.created_on = transaction.created_on;
        this.amount = transaction.amount;
        this.contra_account = transaction.contra_account;
        this.account = transaction.account;
        this.executed_on = transaction.executed_on;
        this.id = transaction.id;
        this.accountName = accountName;
        this.contraAccountName = contraAccountName;
    }
}
