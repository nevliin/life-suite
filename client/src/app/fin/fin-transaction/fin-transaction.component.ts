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

    constructor(
        readonly finService: FinService
    ) {
    }

    ngOnInit() {
    }

}
