import {Component, OnInit} from '@angular/core';
import {InvEntry} from "../../inv/inv-entry";
import {InvService} from "../../inv/inv.service";
import {ErrorHandlingService} from "../../core/error-handling/error-handling.service";

@Component({
    selector: 'tile-inv-expirations',
    templateUrl: './tile-inv-expirations.component.html',
    styleUrls: ['./tile-inv-expirations.component.css']
})
export class TileInvExpirationsComponent implements OnInit {

    nextExpiringEntries: InvEntry[] = [];

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
            this.findNextExpirations((await this.invService.getEntries()).sort((entry1, entry2) => entry1.expirationDate.getTime() - entry2.expirationDate.getTime()));
        } catch (e) {
            this.errorHandlingService.handleHTTPError(e);
        }
    }

    findNextExpirations(entries: InvEntry[]) {
        this.nextExpiringEntries = entries
            .filter((entry: InvEntry) => entry.expirationDate.getTime() > (new Date()).getTime())
            .sort((a: InvEntry, b: InvEntry) => a.expirationDate.getTime() - b.expirationDate.getTime())
            .slice(0, 3);
    }

}
