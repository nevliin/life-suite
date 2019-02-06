import {Component, EventEmitter, OnInit} from '@angular/core';
import {InvEntry} from '../../inv/inv-entry';
import {InvService} from '../../inv/inv.service';
import {ErrorHandlingService} from '../../core/error-handling/error-handling.service';
import {OnTileLoadingDone} from '../tile-container/on-tile-loading-done';

@Component({
    selector: 'tile-inv-expirations',
    templateUrl: './tile-inv-expirations.component.html',
    styleUrls: ['./tile-inv-expirations.component.css']
})
export class TileInvExpirationsComponent implements OnInit, OnTileLoadingDone {

    nextExpiringEntries: InvEntry[] = [];
    loadingDone: EventEmitter<boolean> = new EventEmitter();

    dateFormat = 'dd.MM.yyyy';

    constructor(
        readonly invService: InvService,
        readonly errorHandlingService: ErrorHandlingService
    ) {
    }

    async ngOnInit() {
        await this.fetchEntries();
    }

    async fetchEntries() {
        try {
            this.findNextExpirations((await this.invService.getEntries(1))
                .sort((entry1, entry2) => entry1.expiration_date.getTime() - entry2.expiration_date.getTime()));
        } catch (e) {
            this.errorHandlingService.handleHTTPError(e);
        }
        this.loadingDone.emit(true);
    }

    findNextExpirations(entries: InvEntry[]) {
        this.nextExpiringEntries = entries
            .filter((entry: InvEntry) => entry.expiration_date.getTime() > (new Date()).getTime())
            .sort((a: InvEntry, b: InvEntry) => a.expiration_date.getTime() - b.expiration_date.getTime())
            .slice(0, 10);
    }

}
