import {Injectable} from '@angular/core';
import {MatDialog} from "@angular/material";
import {AlertDialogConfirmComponent} from "./alert-dialog-confirm/alert-dialog-confirm.component";

@Injectable({
    providedIn: 'root'
})
export class AlertDialogService {

    constructor(
        readonly dialogService: MatDialog
    ) {
    }

    async confirm(text: string): Promise<boolean> {
        debugger;
        const dialogRef = this.dialogService.open(AlertDialogConfirmComponent, { data: { text: text }});
        return await dialogRef.afterClosed().toPromise();
    }
}
