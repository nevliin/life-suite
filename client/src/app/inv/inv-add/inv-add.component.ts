import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {InvEntry} from "../inv-entry";
import {InvService} from "../inv.service";

@Component({
    selector: 'app-inv-add',
    templateUrl: './inv-add.component.html',
    styleUrls: ['./inv-add.component.css']
})
export class InvAddComponent implements OnInit {

    nextId: number;

    entryForm: FormGroup = new FormGroup({
        id: new FormControl(),
        name: new FormControl(),
        amount: new FormControl(),
        market: new FormControl(),
        price: new FormControl(),
        producer: new FormControl(),
        weight: new FormControl(),
        kcal: new FormControl(),
        expirationDate: new FormControl(),
        note: new FormControl()
    });

    constructor(
        readonly invService: InvService
    ) {
    }

    async ngOnInit() {
        this.nextId = await this.invService.getNextId();
        this.entryForm.get('id').setValue(this.nextId);
    }

    async submit() {
        const entry: InvEntry = {
            name: this.entryForm.get('name').value,
            kcal: this.entryForm.get('kcal').value,
            market: this.entryForm.get('market').value,
            note: this.entryForm.get('note').value,
            expiration_date: this.entryForm.get('expirationDate').value,
            price: this.entryForm.get('price').value,
            producer: this.entryForm.get('producer').value,
            weight_in_g: this.entryForm.get('weight').value,
            valid: null,
            id: null,
            created_on: null,
            stock_id: null,
            target_id: null
        };
        if (this.entryForm.get('amount').value === 1) {
            entry.id = this.entryForm.get('id').value;
            await this.invService.createEntry(entry);
        } else if(this.entryForm.get('amount').value >= 1) {

        }

        await this.invService.createEntry(entry);
    }

    async autoFill() {
        const result: InvEntry = await this.invService.getAutoFill(this.entryForm.get('name').value);
        this.entryForm.patchValue(result as any);
        const expirationDate: Date = new Date(result.expiration_date);
        this.entryForm.get('expirationDate').setValue(expirationDate.getFullYear() + '-' + expirationDate.getUTCMonth() + '-' + expirationDate.getUTCDay());
    }

    adjustIds(amount: number) {
        if (amount === 1) {
            this.entryForm.get('id').setValue(this.nextId);
        } else if (amount > 1) {
            this.entryForm.get('id').setValue(this.nextId + '-' + (this.nextId + amount - 1));
        }
    }

}
