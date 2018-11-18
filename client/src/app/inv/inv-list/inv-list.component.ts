import {Component, OnInit} from '@angular/core';
import {SelectItem} from "primeng/api";
import {FormControl, FormGroup} from "@angular/forms";
import {InvEntry} from "../inv-entry";
import {ErrorHandlingService} from "../../core/error-handling/error-handling.service";
import {InvService} from "../inv.service";

@Component({
    selector: 'app-inv-list',
    templateUrl: './inv-list.component.html',
    styleUrls: ['./inv-list.component.css']
})
export class InvListComponent implements OnInit {

    orderOptions: SelectItem[] = [
        {
            label: 'ID',
            value: OrderOptions.ID
        },
        {
            label: 'Name',
            value: OrderOptions.NAME
        },
        {
            label: 'Ablaufdatum',
            value: OrderOptions.EXPIRATION
        }
    ];

    orderForm: FormGroup = new FormGroup({
        selectedOrder: new FormControl('id')
    });

    entries: InvEntry[];

    constructor(
        readonly invService: InvService,
        readonly errorHandlingService: ErrorHandlingService
    ) {
    }

    async ngOnInit() {
        await this.fetchEntries();
    }

    async fetchEntries() {
        this.entries = await this.invService.getEntries().catch((e) => {
            this.errorHandlingService.handleHTTPError(e);
            return [];
        });
    }

    async eatConfirmation(id: number) {
        await this.invService.deleteEntry(id);
        const index: number = this.entries.findIndex((entry: InvEntry) => entry.id === id);
        this.entries.splice(index, 1);
        this.fetchEntries();
    }

    sortEntries(value: OrderOptions) {
        this.entries.sort((value1: InvEntry, value2: InvEntry): number => {
            if (value === OrderOptions.ID) {
                return value1.id - value2.id;
            }
            if (value === OrderOptions.NAME) {
                return value1.name.localeCompare(value2.name);
            }
            if (value === OrderOptions.EXPIRATION) {
                return value1.expirationDate.getTime() - value2.expirationDate.getTime();
            }
        });
    }

}

enum OrderOptions {
    ID = 'ID',
    NAME = 'NAME',
    EXPIRATION = 'EXPIRATION'
}
