import {Component, OnInit} from '@angular/core';
import {CompareEntry} from '../compare-entry';
import {ErrorHandlingService} from '../../core/error-handling/error-handling.service';
import {InvService} from '../inv.service';

@Component({
    selector: 'app-inv-comparison',
    templateUrl: './inv-comparison.component.html',
    styleUrls: ['./inv-comparison.component.css']
})
export class InvComparisonComponent implements OnInit {

    comparison: CompareEntry[] = [];

    constructor(
        readonly invService: InvService,
        readonly errorHandlingService: ErrorHandlingService
    ) {
        this.invService.currentStockId$.subscribe(async value => {
            if (value) {
                this.comparison = await this.invService.getComparison(value);
                this.comparison = this.comparison.filter(compareEntry => compareEntry.amount !== 0);
            }
        });
    }

    async ngOnInit() {
    }


}
