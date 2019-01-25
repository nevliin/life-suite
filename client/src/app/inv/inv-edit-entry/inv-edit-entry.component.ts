import {Component, Inject, OnInit, Optional} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {InvEntry} from '../inv-entry';
import {InvService} from '../inv.service';
import {InvTargetEntry} from '../inv-target-entry';
import {AlertDialogService} from '../../core/alert-dialog/alert-dialog.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MessageService} from 'primeng/api';

@Component({
    selector: 'app-inv-edit-entry',
    templateUrl: './inv-edit-entry.component.html',
    styleUrls: ['./inv-edit-entry.component.css']
})
export class InvEditEntryComponent implements OnInit {

    new = true;

    entryForm: FormGroup = this.fb.group({
        name: ['', Validators.required],
        target_id: [null, Validators.required],
        amount: [1, Validators.required],
        market: [null],
        price: [null],
        producer: [null],
        weight_in_g: [null],
        kcal: [null, Validators.required],
        expiration_date: [new Date(), Validators.required],
        note: [null]
    });

    targetEntries: InvTargetEntry[] = [];

    constructor(
        readonly invService: InvService,
        readonly fb: FormBuilder,
        private readonly alertDialogService: AlertDialogService,
        private readonly messageService: MessageService,
        @Optional() @Inject(MAT_DIALOG_DATA) private readonly data: { entry?: InvEntry },
        @Optional() private readonly dialogRef: MatDialogRef<InvEditEntryComponent>
    ) {
        this.invService.currentStockId$.subscribe(async value => {
            if (value) {
                this.targetEntries = await this.invService.getTargetEntries(value);
            }
        });
    }

    async ngOnInit() {
        if (this.data) {
            this.new = false;
            await this.initData(this.data.entry);
        }
    }

    async initData(entry: InvEntry) {
        this.entryForm.patchValue(entry);
        const expirationDate: Date = new Date(entry.expiration_date);
        this.entryForm.get('expiration_date').setValue(expirationDate.toISOString().split('T')[0]);
        this.entryForm.updateValueAndValidity();
    }

    async submit() {
        const entry: InvEntry = {
            name: this.entryForm.get('name').value,
            kcal: this.entryForm.get('kcal').value,
            market: this.entryForm.get('market').value,
            note: this.entryForm.get('note').value,
            expiration_date: this.entryForm.get('expiration_date').value,
            price: this.entryForm.get('price').value,
            producer: this.entryForm.get('producer').value,
            weight_in_g: this.entryForm.get('weight_in_g').value,
            stock_id: this.invService.currentStockId$.getValue(),
            target_id: this.entryForm.get('target_id').value
        };
        if (this.new) {
            const ids: number[] = await this.invService.createEntries(entry, this.entryForm.get('amount').value);
            await this.alertDialogService.info(`The entries were created with the following identifiers: ${ids.join(', ')}`);
        } else {
            entry.id = this.data.entry.id;
            entry.stock_id = this.data.entry.stock_id;
            entry.valid = this.data.entry.valid;
            await this.invService.updateEntry(entry);
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                life: 3000,
                detail: 'Successfully updated transaction #'
            });
            this.dialogRef.close();
        }
    }

    async autoFill() {
        const result: InvEntry = await this.invService.getAutoFill(this.entryForm.get('name').value);
        if (result) {
            this.entryForm.patchValue(result as any);
            const expirationDate: Date = new Date(result.expiration_date);
            this.entryForm.get('expiration_date').setValue(expirationDate.toISOString().split('T')[0]);
        }
    }

    cancel() {
        if (this.new) {
            this.entryForm.reset();
        } else {
            this.dialogRef.close();
        }
    }


}
