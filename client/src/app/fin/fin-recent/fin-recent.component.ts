import {Component, OnInit} from '@angular/core';
import {FinService} from "../fin.service";
import {FinTransaction} from "../fin-transaction";

@Component({
    selector: 'app-fin-recent',
    templateUrl: './fin-recent.component.html',
    styleUrls: ['./fin-recent.component.css']
})
export class FinRecentComponent implements OnInit {

    recentTransactions: FinTransactionDisplay[] = [];

    constructor(
        readonly finService: FinService
    ) {
    }

    async ngOnInit() {
        const tempArray: FinTransaction[] = await this.finService.getRecentTransactions();
        for(const transaction of tempArray) {
            this.recentTransactions.push(new FinTransactionDisplay(
                transaction,
                (await this.finService.getAccountById(transaction.account)).name,
                (await this.finService.getAccountById(transaction.contra_account)).name)
            );
        }
    }

    async openTransactionDetails(transactionId: number) {

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
