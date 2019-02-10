import {Component, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {FinAccount} from '../fin-account';
import {FinService} from '../fin.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {TwoWayMap} from '../../core/auth/two-way-map';
import {MAT_DIALOG_DATA, MatAutocompleteTrigger, MatDialogRef} from '@angular/material';
import {FinTransaction} from '../fin-transaction';
import {MessageService} from 'primeng/api';

@Component({
    selector: 'app-fin-transaction-edit',
    templateUrl: './fin-transaction-edit.component.html',
    styleUrls: ['./fin-transaction-edit.component.css']
})
export class FinTransactionEditComponent implements OnInit {

    @ViewChild('account', {read: MatAutocompleteTrigger}) account: MatAutocompleteTrigger;
    @ViewChild('contraAccount', {read: MatAutocompleteTrigger}) contraAccount: MatAutocompleteTrigger;

    keyDownValue: string = 'placeholder';

    new: boolean = true;

    accountsTwoWay: TwoWayMap<number, string>;
    accountIds: number[] = [];
    accountIds$: BehaviorSubject<number[]> = new BehaviorSubject([]);
    accountNames: string[];

    filteredAccountOptions: Observable<number[]>;
    filteredAccountNameOptions: Observable<string[]>;
    filteredContraAccountOptions: Observable<number[]>;
    filteredContraAccountNameOptions: Observable<string[]>;

    transactionForm: FormGroup = this.fb.group({
        id: [null],
        account: [null, Validators.compose([
            Validators.required,
            Validators.min(0),
            Validators.max(9999),
            Validators.pattern('[0-9]*'),
            this.accountExistsValidatorFactory(this.accountIds$)
        ]),
            this.validateAccountExists.bind(this)],
        accountName: [''],
        contraAccount: [null, Validators.compose([
            Validators.required,
            Validators.min(0),
            Validators.max(9999),
            Validators.pattern('[0-9]*'),
            this.accountExistsValidatorFactory(this.accountIds$)
        ])],
        contraAccountName: [''],
        amount: [null, Validators.compose([Validators.min(0.01), Validators.required])],
        currency: ['euro', Validators.required],
        createdOn: [new Date().toISOString().split('T')[0], Validators.required],
        note: ['', Validators.maxLength(255)]
    }, {
        validator: this.sameAccountValidator
    });

    currencies: { value: string, viewValue: string }[] = [
        {value: 'euro', viewValue: 'EUR'}
    ];

    constructor(
        readonly fb: FormBuilder,
        readonly finService: FinService,
        readonly messageService: MessageService,
        @Optional() @Inject(MAT_DIALOG_DATA) private readonly data: {
            transactionId: number,
            transaction?: FinTransaction,
            accountsById?: Map<number, FinTransaction>
        },
        @Optional() private readonly dialogRef: MatDialogRef<FinTransactionEditComponent>
    ) {
    }

    async ngOnInit() {
        const tempMap: Map<number, string> = new Map();
        (await this.finService.getAccounts()).forEach((value: FinAccount) => tempMap.set(value.id, value.name));
        this.accountsTwoWay = new TwoWayMap(tempMap);
        this.accountIds = Array.from(this.accountsTwoWay.map.keys());
        this.accountIds$.next(this.accountIds);

        Object.keys(this.transactionForm.controls).forEach(field => {
            const control = this.transactionForm.get(field);
            control.updateValueAndValidity();

        });

        this.accountNames = Array.from(this.accountsTwoWay.reverseMap.keys());
        this.setUpAutoComplete();
        if (this.data) {
            this.new = false;
            await this.insertEditData();
        }
    }

    sameAccountValidator(control: AbstractControl): { [key: string]: any } | null {
        if (control.get('account').value && control.get('contraAccount')) {
            return Number.parseInt(control.get('account').value) === Number.parseInt(control.get('contraAccount').value)
                ? {match: false}
                : null;
        } else {
            return null;
        }
    }

    accountExistsValidatorFactory(accountIds$: BehaviorSubject<number[]>): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} | null => {
            return accountIds$.getValue().includes(Number.parseInt(control.value)) ? null : {exists: false};
        };
    }

/*    accountExists(control: AbstractControl): { [key: string]: any } | null {
        return this.accountIds.includes(control.value) ? null : {exists: false};
    }*/

    async insertEditData() {
        let transaction: FinTransaction;
        if (this.data.transaction) {
            transaction = this.data.transaction;
        } else {
            transaction = await this.finService.getTransaction(this.data.transactionId);
        }
        this.transactionForm.get('id').setValue(transaction.id);
        this.transactionForm.get('account').setValue(transaction.account);
        this.updateAccountName(transaction.account.toString(), 'accountName');
        this.transactionForm.get('contraAccount').setValue(transaction.contra_account);
        this.updateAccountName(transaction.contra_account.toString(), 'contraAccountName');
        this.transactionForm.get('amount').setValue(transaction.amount);
        this.transactionForm.get('createdOn').setValue(transaction.created_on.toISOString().split('T')[0]);
        this.transactionForm.get('note').setValue(transaction.note);
    }

    cancel() {
        if (this.new) {
            this.reset();
        } else {
            this.dialogRef.close();
        }
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
            if (this.new) {
                const transaction: FinTransaction = new FinTransaction();
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
                const transaction: FinTransaction = new FinTransaction();
                transaction.id = Number.parseInt(this.transactionForm.get('id').value);
                transaction.account = Number.parseInt(this.transactionForm.get('account').value);
                transaction.contra_account = Number.parseInt(this.transactionForm.get('contraAccount').value);
                transaction.amount = Number.parseFloat(this.transactionForm.get('amount').value);
                transaction.created_on = this.transactionForm.get('createdOn').value;
                transaction.note = this.transactionForm.get('note').value;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    life: 3000,
                    detail: 'Successfully updated transaction #' + await this.finService.updateTransaction(transaction)
                });
                this.dialogRef.close();
            }
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
        });
    }

    private _filterByName(value: string): string[] {
        if (value === null) {
            return this.accountNames;
        }
        return this.accountNames.filter((accountName: string) => {
            return (accountName) ? accountName.toLowerCase().includes(value.toLowerCase()) : true;
        });
    }

    changeFocus($event, formControlName: string, previous, next) {
        if (!this.new) {
            return;
        }
        let autoCompleteTrigger: MatAutocompleteTrigger;
        switch (formControlName) {
            case 'account':
                autoCompleteTrigger = this.account;
                break;
            case 'contraAccount':
                autoCompleteTrigger = this.contraAccount;
                break;
        }
        if ($event.key === 'Backspace'
            && (this.transactionForm.get(formControlName).value === '' || this.transactionForm.get(formControlName).value === null)
            && previous !== undefined
            && (this.keyDownValue === null || this.keyDownValue === '')
        ) {
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
