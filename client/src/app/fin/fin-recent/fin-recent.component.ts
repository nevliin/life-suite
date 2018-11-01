import {Component, OnInit} from '@angular/core';
import {FinService} from "../fin.service";
import {FinTransaction} from "../fin-transaction";

@Component({
    selector: 'app-fin-recent',
    templateUrl: './fin-recent.component.html',
    styleUrls: ['./fin-recent.component.css']
})
export class FinRecentComponent implements OnInit {

    recentTransactions: FinTransaction[] = [];

    constructor(
        readonly finService: FinService
    ) {
    }

    async ngOnInit() {
        this.recentTransactions = await this.finService.getRecentTransactions();
    }


}
