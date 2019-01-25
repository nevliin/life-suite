import {Component, Inject, OnInit, Optional} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {InvService} from '../inv.service';
import {InvTargetEntry} from '../inv-target-entry';
import {AlertDialogService} from '../../core/alert-dialog/alert-dialog.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MessageService} from 'primeng/api';

@Component({
    selector: 'app-inv-edit-target-entry',
    templateUrl: './inv-edit-target-entry.component.html',
    styleUrls: ['./inv-edit-target-entry.component.css']
})
export class InvEditTargetEntryComponent implements OnInit {

    new = true;

    entryForm: FormGroup = this.fb.group({
        name: ['', Validators.required],
        amount: [1, Validators.required]
    });

    constructor(
        readonly invService: InvService,
        readonly fb: FormBuilder,
        private readonly alertDialogService: AlertDialogService,
        private readonly messageService: MessageService,
        @Optional() @Inject(MAT_DIALOG_DATA) private readonly data: { entry?: InvTargetEntry },
        @Optional() private readonly dialogRef: MatDialogRef<InvEditTargetEntryComponent>
    ) {
    }

    async ngOnInit() {
        if (this.data) {
            this.new = false;
            await this.initData(this.data.entry);
        }
    }

    async initData(entry: InvTargetEntry) {
        this.entryForm.patchValue(entry);
    }

    async submit() {
        const entry: InvTargetEntry = {
            name: this.entryForm.get('name').value,
            amount: this.entryForm.get('amount').value,
            stock_id: this.invService.currentStockId$.getValue()
        };
        if (this.new) {
            await this.invService.createTargetEntry(entry);
            this.dialogRef.close();
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                life: 3000,
                detail: 'Successfully created target entry'
            });
        } else {
            entry.id = this.data.entry.id;
            entry.stock_id = this.data.entry.stock_id;
            await this.invService.updateTargetEntry(entry);
            this.dialogRef.close();
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                life: 3000,
                detail: 'Successfully updated target entry'
            });
        }
    }

    cancel() {
        this.dialogRef.close();
    }


}
