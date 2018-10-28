import {Component, OnInit} from '@angular/core';
import {SelectItem} from "primeng/api";
import {FormControl, FormGroup} from "@angular/forms";
import {InvEntry} from "../inv-entry";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {ErrorHandlingService} from "../../core/error-handling/error-handling.service";

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
        readonly http: HttpClient,
        readonly errorHandlingService: ErrorHandlingService
    ) {
    }

    async ngOnInit() {
        await this.fetchEntries();
    }

    async fetchEntries() {
        try {
            this.entries = await this.http.get('/api/inv/entry/list')
                .pipe(map((response: { data: InvEntry[] }) => {
                        return response.data
                            .map((entry: InvEntry) => {
                                entry.expirationDate = new Date(entry.expirationDate);
                                return entry;
                            })
                    })
                ).toPromise().catch((e) => {
                    throw e
                });
        } catch (e) {
            this.errorHandlingService.handleHTTPError(e);
        }
    }

    async eatConfirmation(id: number) {
        await this.http.delete('/api/inv/entry/delete/' + id).toPromise();
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
