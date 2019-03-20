import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {AlertDialogConfirmComponent} from './alert-dialog-confirm/alert-dialog-confirm.component';
import {AlertDialogInfoComponent} from './alert-dialog-info/alert-dialog-info.component';

@Injectable({
    providedIn: 'root'
})
export class AlertDialogService {

    constructor(
        readonly dialogService: MatDialog
    ) {
    }

    async confirm(text: string): Promise<boolean> {
        const dialogRef = this.dialogService.open(AlertDialogConfirmComponent, {data: {text: text}});
        return await dialogRef.afterClosed().toPromise();
    }

    async info(text: string): Promise<void> {
        const dialogRef = this.dialogService.open(AlertDialogInfoComponent, {data: {text: text}});
        await dialogRef.afterClosed().toPromise();
    }
}
