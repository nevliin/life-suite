import {Component, OnInit} from '@angular/core';
import {InvEntry} from '../inv-entry';
import {FormControl, FormGroup} from '@angular/forms';
import {ErrorHandlingService} from '../../core/error-handling/error-handling.service';
import {InvService} from '../inv.service';

@Component({
    selector: 'app-inv-expirations',
    templateUrl: './inv-expirations.component.html',
    styleUrls: ['./inv-expirations.component.css']
})
export class InvExpirationsComponent implements OnInit {

    expirationsForm: FormGroup = new FormGroup({
        months: new FormControl(3)
    });

    entries: InvEntry[] = [];
    expiredEntries: InvEntry[] = [];
    nextExpiringEntries: InvEntry[] = [];

    constructor(
        readonly invService: InvService,
        readonly errorHandlingService: ErrorHandlingService
    ) {
        this.invService.currentStockId$.subscribe(async value => {
            if (value) {
                await this.fetchEntries();
            }
        });
    }

    async fetchEntries() {
        this.entries = (await this.invService.getEntries(this.invService.currentStockId$.getValue()))
            .sort((entry1, entry2) => entry1.expiration_date.getTime() - entry2.expiration_date.getTime());
        this.expiredEntries = this.entries.filter(entry => entry.expiration_date.getTime() < (new Date()).getTime());
        this.findNextExpirations();
    }

    findNextExpirations() {
        const months: number = Number.parseInt(this.expirationsForm.get('months')!.value);
        this.nextExpiringEntries = this.entries.filter(entry => {
            const date: Date = new Date();
            date.setMonth(date.getMonth() + months);
            return date.getTime() > entry.expiration_date.getTime() && entry.expiration_date.getTime() > (new Date()).getTime();
        });
    }

    ngOnInit(): void {
    }
}
