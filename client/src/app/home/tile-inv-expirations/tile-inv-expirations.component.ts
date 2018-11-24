import {Component, EventEmitter, OnInit} from '@angular/core';
import {InvEntry} from "../../inv/inv-entry";
import {InvService} from "../../inv/inv.service";
import {ErrorHandlingService} from "../../core/error-handling/error-handling.service";
import {ITileComponent} from "../ad-tile/itile-component";

@Component({
    selector: 'tile-inv-expirations',
    templateUrl: './tile-inv-expirations.component.html',
    styleUrls: ['./tile-inv-expirations.component.css']
})
export class TileInvExpirationsComponent implements OnInit, ITileComponent {

    nextExpiringEntries: InvEntry[] = [];
    loadingDone: EventEmitter<boolean> = new EventEmitter();

    constructor(
        readonly invService: InvService,
        readonly errorHandlingService: ErrorHandlingService
    ) {
    }

    ngOnInit() {
        this.fetchEntries();
    }

    async fetchEntries() {
        try {
            this.findNextExpirations((await this.invService.getEntries()).sort((entry1, entry2) => entry1.expirationDate.getTime() - entry2.expirationDate.getTime()));
        } catch (e) {
            this.errorHandlingService.handleHTTPError(e);
        }
        this.loadingDone.emit(true);
    }

    findNextExpirations(entries: InvEntry[]) {
        this.nextExpiringEntries = entries
            .filter((entry: InvEntry) => entry.expirationDate.getTime() > (new Date()).getTime())
            .sort((a: InvEntry, b: InvEntry) => a.expirationDate.getTime() - b.expirationDate.getTime())
            .slice(0, 4);
    }

}
