import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FinAccount} from "../fin-account";
import {FinService} from "../fin.service";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {TwoWayMap} from "../../core/auth/two-way-map";
import {MatAutocompleteTrigger} from "@angular/material";
import {FinTransaction} from "../fin-transaction";
import {MessageService} from "primeng/api";

@Component({
    selector: 'app-fin-add',
    templateUrl: './fin-add.component.html',
    styleUrls: ['./fin-add.component.css']
})
export class FinAddComponent implements OnInit {

    @ViewChild('account', {read: MatAutocompleteTrigger}) account: MatAutocompleteTrigger;
    @ViewChild('contraAccount', {read: MatAutocompleteTrigger}) contraAccount: MatAutocompleteTrigger;

    accountsTwoWay: TwoWayMap<number, string>;
    accountIds: number[];
    accountNames: string[];

    filteredAccountOptions: Observable<number[]>;
    filteredAccountNameOptions: Observable<string[]>;
    filteredContraAccountOptions: Observable<number[]>;
    filteredContraAccountNameOptions: Observable<string[]>;

    transactionForm: FormGroup = this.fb.group({
        account: [null, Validators.compose([
            Validators.required,
            Validators.min(0),
            Validators.max(9999),
            Validators.pattern('[0-9]*')
        ]),
            this.validateAccountExists.bind(this)],
        accountName: [''],
        contraAccount: [null, Validators.compose([
            Validators.required,
            Validators.min(0),
            Validators.max(9999),
            Validators.pattern('[0-9]*')
        ])],
        contraAccountName: [''],
        amount: [null],
        currency: ['euro'],
        createdOn: [new Date().toISOString().split('T')[0], Validators.required],
        note: ['', Validators.maxLength(255)]
    });

    currencies: { value: string, viewValue: string }[] = [
        {value: 'euro', viewValue: 'EUR'}
    ];

    constructor(
        readonly fb: FormBuilder,
        readonly finService: FinService,
        readonly messageService: MessageService
    ) {
    }

    async ngOnInit() {
        const tempMap: Map<number, string> = new Map();
        (await this.finService.getAccounts()).forEach((value: FinAccount) => tempMap.set(value.id, value.name));
        this.accountsTwoWay = new TwoWayMap(tempMap);
        this.accountIds = Array.from(this.accountsTwoWay.map.keys());
        this.accountNames = Array.from(this.accountsTwoWay.reverseMap.keys());
        this.setUpAutoComplete();
    }

    reset() {
        this.transactionForm.reset();
        this.transactionForm.get('currency').setValue('euro');
        this.transactionForm.get('createdOn').setValue(new Date().toISOString().split('T')[0]);
    }

    setUpAutoComplete() {
        this.filteredAccountOptions = this.transactionForm.get('account').valueChanges.pipe(
            startWith(''),
            map((value: number) => this._filterById(value))
        );
        this.filteredContraAccountOptions = this.transactionForm.get('contraAccount').valueChanges.pipe(
            startWith(''),
            map((value: number) => this._filterById(value))
        );
        this.filteredAccountNameOptions = this.transactionForm.get('accountName').valueChanges.pipe(
            startWith(''),
            map(value => this._filterByName(value))
        );
        this.filteredContraAccountNameOptions = this.transactionForm.get('contraAccountName').valueChanges.pipe(
            startWith(''),
            map(value => this._filterByName(value))
        );
    }

    async submit() {
        if (this.transactionForm.valid) {
            let transaction: FinTransaction = new FinTransaction();
            transaction.account = Number.parseInt(this.transactionForm.get('account').value);
            transaction.contra_account = Number.parseInt(this.transactionForm.get('contraAccount').value);
            transaction.amount = Number.parseFloat(this.transactionForm.get('amount').value);
            transaction.created_on = this.transactionForm.get('createdOn').value;
            transaction.note = this.transactionForm.get('note').value;
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                life: 3000,
                detail: 'Successfully created transaction #' + await this.finService.createTransaction(transaction)
            });
            this.reset();
        } else {
            this.messageService.add({severity: 'warn', summary: 'Warning', life: 3000, detail: 'Form is invalid'});
        }
    }

    private _filterById(value: number): number[] {
        let filterValue: string;
        if (value !== null) {
            filterValue = value.toString();
        } else {
            filterValue = '';
        }

        return this.accountIds.filter((accountId: number) => {
            return accountId.toString().includes(filterValue);
        })
    }

    private _filterByName(value: string): string[] {
        if(value === null) {
            return this.accountNames;
        }
        return this.accountNames.filter((accountName: string) => {
            debugger;
            return (accountName) ? accountName.toLowerCase().includes(value.toLowerCase()) : true;
        })
    }

    changeFocus($event, formControlName: string, previous, next) {
        let autoCompleteTrigger: MatAutocompleteTrigger;
        switch (formControlName) {
            case 'account':
                autoCompleteTrigger = this.account;
                break;
            case 'contraAccount':
                autoCompleteTrigger = this.contraAccount;
                break;
        }
        if ($event.key === 'Backspace' && (this.transactionForm.get(formControlName).value === '' || this.transactionForm.get(formControlName).value === null) && previous !== undefined) {
            previous.focus();
            if (autoCompleteTrigger !== undefined) {
                autoCompleteTrigger.closePanel();
            }
        }
        if ($event.key === 'ArrowLeft' && previous !== undefined) {
            previous.focus();
            if (autoCompleteTrigger !== undefined) {
                autoCompleteTrigger.closePanel();
            }
        }
        if ($event.key === 'ArrowRight' && next !== undefined) {
            next.focus();
            if (autoCompleteTrigger !== undefined) {
                autoCompleteTrigger.closePanel();
            }
        }
        if (
            $event.key !== 'Backspace'
            && this.transactionForm.get(formControlName).value !== null
            && this.transactionForm.get(formControlName).value.toString().length === 4
            && next !== undefined
        ) {
            this.updateAccountName(this.transactionForm.get(formControlName).value, formControlName + 'Name');
            next.focus();
            if (autoCompleteTrigger !== undefined) {
                autoCompleteTrigger.closePanel();
            }
        }
    }

    updateAccountName(value: string, formControlName: string) {
        this.transactionForm.get(formControlName).setValue(this.accountsTwoWay.get(Number.parseInt(value)));
    }

    updateAccount(value: any, formControlName: string) {
        this.transactionForm.get(formControlName).setValue(this.accountsTwoWay.revGet(value));
    }

    async validateAccountExists(control: AbstractControl): Promise<any> {
        return (this.accountIds.includes(Number.parseInt(control.value))) ? null : {accountDoesntExist: true};
    }

}
