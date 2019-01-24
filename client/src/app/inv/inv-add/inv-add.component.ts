import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {InvEntry} from '../inv-entry';
import {InvService} from '../inv.service';
import {InvTargetEntry} from '../inv-target-entry';
import {AlertDialogService} from '../../core/alert-dialog/alert-dialog.service';

@Component({
    selector: 'app-inv-add',
    templateUrl: './inv-add.component.html',
    styleUrls: ['./inv-add.component.css']
})
export class InvAddComponent implements OnInit {

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
        private readonly alertDialogService: AlertDialogService
    ) {
        this.invService.currentStockId$.subscribe(async value => {
            if (value) {
                this.targetEntries = await this.invService.getTargetEntries(value);
            }
        });
    }

    async ngOnInit() {
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
        const ids: number[] = await this.invService.createEntries(entry, this.entryForm.get('amount').value);
        debugger;
        await this.alertDialogService.info(`The entries were created with the following identifiers: ${ids.join(', ')}`);
    }

    async autoFill() {
        const result: InvEntry = await this.invService.getAutoFill(this.entryForm.get('name').value);
        if (result) {
            this.entryForm.patchValue(result as any);
            const expirationDate: Date = new Date(result.expiration_date);
            this.entryForm.get('expiration_date').setValue(expirationDate.toISOString().split('T')[0]);
        }
    }


}
