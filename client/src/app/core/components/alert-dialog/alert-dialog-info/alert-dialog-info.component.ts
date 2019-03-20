import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-alert-dialog-info',
    templateUrl: './alert-dialog-info.component.html'
})
export class AlertDialogInfoComponent implements OnInit {

    text: string = '';

    constructor(
        public dialogRef: MatDialogRef<AlertDialogInfoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { text: string },
    ) {
        this.text = this.data.text;
    }

    ngOnInit() {
    }

    submit() {
        this.dialogRef.close();
    }

}
