import {Component, OnInit} from '@angular/core';
import {InvTargetEntry} from '../inv-target-entry';
import {ErrorHandlingService} from '../../core/error-handling/error-handling.service';
import {InvService} from '../inv.service';

@Component({
    selector: 'app-inv-target',
    templateUrl: './inv-target.component.html',
    styleUrls: ['./inv-target.component.css']
})
export class InvTargetComponent implements OnInit {

    targetEntries: InvTargetEntry[] = [];

    constructor(
        readonly invService: InvService,
        readonly errorHandlingService: ErrorHandlingService
    ) {
        this.invService.currentStockId$.subscribe(async value => {
            if (value) {
                this.targetEntries = await this.invService.getTargetEntries(value);
            }
        });
    }

    async ngOnInit() {
    }


}
