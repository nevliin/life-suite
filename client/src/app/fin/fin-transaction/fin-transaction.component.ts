import {Component, Input, OnInit} from '@angular/core';
import {FinTransaction} from "../fin-transaction";
import {FinService} from "../fin.service";

@Component({
    selector: 'fin-transaction',
    templateUrl: './fin-transaction.component.html',
    styleUrls: ['./fin-transaction.component.css']
})
export class FinTransactionComponent implements OnInit {

    @Input() transaction: FinTransaction;
    accountName: string;
    contraAccountName: string;

    constructor(
        readonly finService: FinService
    ) {
    }

    async ngOnInit() {
        this.accountName = (await this.finService.getAccountById(this.transaction.account)).name;
        this.contraAccountName = (await this.finService.getAccountById(this.transaction.contra_account)).name;
    }

}
