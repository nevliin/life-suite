import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
    selector: 'app-alert-dialog-confirm',
    templateUrl: './alert-dialog-confirm.component.html'
})
export class AlertDialogConfirmComponent implements OnInit {

    text: string = '';

    constructor(
        public dialogRef: MatDialogRef<AlertDialogConfirmComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { text: string },
    ) {
        debugger;
        this.text = this.data.text;
    }

    ngOnInit() {
    }

    cancel() {
        this.dialogRef.close(false);
    }

    submit() {
        this.dialogRef.close(true);
    }

}
