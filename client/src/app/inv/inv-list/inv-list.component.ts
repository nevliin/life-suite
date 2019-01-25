import {Component, OnInit} from '@angular/core';
import {SelectItem} from 'primeng/api';
import {InvEntry} from '../inv-entry';
import {ErrorHandlingService} from '../../core/error-handling/error-handling.service';
import {InvService} from '../inv.service';
import {AlertDialogService} from '../../core/alert-dialog/alert-dialog.service';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {InvEditEntryComponent} from '../inv-edit-entry/inv-edit-entry.component';

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

    order: OrderOptions = OrderOptions.ID;

    searchTerm: string = '';
    private searchTerm$ = new Subject<string>();
    private searchChange$: Observable<string> = this.searchTerm$.pipe(
        debounceTime(200),
        distinctUntilChanged()
    );

    entries: InvEntry[] = [];

    constructor(
        readonly invService: InvService,
        readonly errorHandlingService: ErrorHandlingService,
        private readonly alertDialogService: AlertDialogService,
        private readonly dialog: MatDialog
    ) {
        this.invService.currentStockId$.subscribe(async value => {
            if (value) {
                await this.fetchEntries();
            }
        });
        this.searchChange$.subscribe(async searchTerm => {
            if (searchTerm && searchTerm.trim()) {
                this.entries = await this.invService.searchEntries(this.invService.stockId, [
                    {
                        field: 'name',
                        value: searchTerm,
                        partialMatch: true
                    }
                ]);
                this.changeOrder(this.order);
            } else {
                await this.fetchEntries();
            }
        });
    }

    async ngOnInit() {
    }

    async fetchEntries() {
        this.entries = await this.invService.getEntries(this.invService.currentStockId$.getValue()).catch((e) => {
            this.errorHandlingService.handleHTTPError(e);
            return [];
        });
        this.changeOrder(this.order);
    }

    async deleteEntry(entryId: number) {
        if (await this.alertDialogService.confirm('Are you sure you want to remove this entry?')) {
            await this.invService.deleteEntry(entryId);
            const index: number = this.entries.findIndex((entry: InvEntry) => entry.id === entryId);
            this.entries.splice(index, 1);
            await this.fetchEntries();
        }
    }

    changeOrder(value: OrderOptions) {
        this.entries.sort((value1: InvEntry, value2: InvEntry): number => {
            if (value === OrderOptions.ID) {
                return value1.id - value2.id;
            }
            if (value === OrderOptions.NAME) {
                return value1.name.localeCompare(value2.name);
            }
            if (value === OrderOptions.EXPIRATION) {
                return value1.expiration_date.getTime() - value2.expiration_date.getTime();
            }
        });
    }

    search(): void {
        this.searchTerm$.next(this.searchTerm);
    }

    editEntry(entry: InvEntry) {
        this.dialog.open(InvEditEntryComponent, {
            panelClass: 'mat-card-dialog-container',
            data: {
                entry: entry
            }
        });
    }

}

enum OrderOptions {
    ID = 'ID',
    NAME = 'NAME',
    EXPIRATION = 'EXPIRATION'
}
