import {Component, OnInit} from '@angular/core';
import {InvTargetEntry} from '../inv-target-entry';
import {ErrorHandlingService} from '../../core/error-handling/error-handling.service';
import {InvService} from '../inv.service';
import {MatDialog} from '@angular/material';
import {InvEditTargetEntryComponent} from '../inv-edit-target-entry/inv-edit-target-entry.component';
import {AlertDialogService} from '../../core/components/alert-dialog/alert-dialog.service';
import {first} from 'rxjs/operators';

@Component({
    selector: 'app-inv-target',
    templateUrl: './inv-target.component.html',
    styleUrls: ['./inv-target.component.css']
})
export class InvTargetComponent implements OnInit {

    targetEntries: InvTargetEntry[] = [];

    constructor(
        readonly invService: InvService,
        readonly errorHandlingService: ErrorHandlingService,
        private readonly dialog: MatDialog,
        private readonly alertDialogService: AlertDialogService
    ) {
        this.invService.currentStockId$.subscribe(async value => {
            await this.fetchTargetEntries(value);
        });
    }

    async ngOnInit() {
    }

    async fetchTargetEntries(stockId: number) {
        if (stockId) {
            this.targetEntries = await this.invService.getTargetEntries(stockId);
        }
    }

    async newTargetEntry() {
        this.dialog.open(InvEditTargetEntryComponent, {
            panelClass: 'mat-card-dialog-container'
        }).afterClosed().pipe(first()).subscribe(async () => {
            await this.fetchTargetEntries(this.invService.stockId);
        });
    }

    async editTargetEntry(entry: InvTargetEntry) {
        this.dialog.open(InvEditTargetEntryComponent, {
            panelClass: 'mat-card-dialog-container',
            data: {
                entry: entry
            }
        }).afterClosed().pipe(first()).subscribe(async () => {
            await this.fetchTargetEntries(this.invService.stockId);
        });
    }

    async deleteTargetEntry(id: number) {
        if (await this.alertDialogService.confirm('Are you sure you want to remove this target entry?')) {
            await this.invService.deleteTargetEntry(id);
            const index: number = this.targetEntries.findIndex((entry: InvTargetEntry) => entry.id === id);
            this.targetEntries.splice(index, 1);
            await this.fetchTargetEntries(this.invService.stockId);
        }
    }


}
