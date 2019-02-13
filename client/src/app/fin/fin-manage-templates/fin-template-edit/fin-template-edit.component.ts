import {Component, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MAT_DIALOG_DATA, MatAutocompleteTrigger, MatDialogRef} from '@angular/material';
import {MessageService} from 'primeng/api';
import {TwoWayMap} from '../../../core/auth/two-way-map';
import {FinService} from '../../fin.service';
import {FinTemplate} from '../../fin-template';
import {FinAccount} from '../../fin-account';

@Component({
    selector: 'app-fin-template-edit',
    templateUrl: './fin-template-edit.component.html',
    styleUrls: ['./fin-template-edit.component.scss']
})
export class FinTemplateEditComponent implements OnInit {

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

    templateForm: FormGroup = this.fb.group({
        id: [null],
        name: [null, Validators.required],
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
        @Inject(MAT_DIALOG_DATA) private readonly data: {
            template: FinTemplate,
            accountsById?: Map<number, FinAccount>
        },
        @Optional() private readonly dialogRef: MatDialogRef<FinTemplateEditComponent>
    ) {
    }

    async ngOnInit() {
        const tempMap: Map<number, string> = new Map();
        (await this.finService.getAccounts()).forEach((value: FinAccount) => tempMap.set(value.id, value.name));
        this.accountsTwoWay = new TwoWayMap(tempMap);
        this.accountIds = Array.from(this.accountsTwoWay.map.keys());
        this.accountIds$.next(this.accountIds);

        Object.keys(this.templateForm.controls).forEach(field => {
            const control = this.templateForm.get(field);
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
        return (control: AbstractControl): { [key: string]: any } | null => {
            return accountIds$.getValue().includes(Number.parseInt(control.value)) ? null : {exists: false};
        };
    }

    async insertEditData() {
        const template: FinTemplate = this.data.template;
        this.templateForm.get('id').setValue(template.id);
        this.templateForm.get('name').setValue(template.name);
        this.templateForm.get('account').setValue(template.account);
        this.updateAccountName(template.account.toString(), 'accountName');
        this.templateForm.get('contraAccount').setValue(template.contra_account);
        this.updateAccountName(template.contra_account.toString(), 'contraAccountName');
        this.templateForm.get('amount').setValue(template.amount);
        this.templateForm.get('note').setValue(template.note);
    }

    cancel() {
        this.dialogRef.close(false);
    }

    setUpAutoComplete() {
        this.filteredAccountOptions = this.templateForm.get('account').valueChanges.pipe(
            startWith(''),
            map((value: number) => this._filterById(value))
        );
        this.filteredContraAccountOptions = this.templateForm.get('contraAccount').valueChanges.pipe(
            startWith(''),
            map((value: number) => this._filterById(value))
        );
        this.filteredAccountNameOptions = this.templateForm.get('accountName').valueChanges.pipe(
            startWith(''),
            map(value => this._filterByName(value))
        );
        this.filteredContraAccountNameOptions = this.templateForm.get('contraAccountName').valueChanges.pipe(
            startWith(''),
            map(value => this._filterByName(value))
        );
    }

    async submit() {
        if (this.templateForm.valid) {
            if (this.new) {
                const template: FinTemplate = new FinTemplate();
                template.account = Number.parseInt(this.templateForm.get('account').value);
                template.contra_account = Number.parseInt(this.templateForm.get('contraAccount').value);
                template.amount = Number.parseFloat(this.templateForm.get('amount').value);
                template.note = this.templateForm.get('note').value;
                template.name = this.templateForm.get('name').value;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    life: 3000,
                    detail: 'Successfully created template #' + await this.finService.createTemplate(template)
                });
            } else {
                const template: FinTemplate = new FinTemplate();
                template.id = Number.parseInt(this.templateForm.get('id').value);
                template.account = Number.parseInt(this.templateForm.get('account').value);
                template.contra_account = Number.parseInt(this.templateForm.get('contraAccount').value);
                template.amount = Number.parseFloat(this.templateForm.get('amount').value);
                template.note = this.templateForm.get('note').value;
                template.name = this.templateForm.get('name').value;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    life: 3000,
                    detail: 'Successfully updated template #' + await this.finService.updateTemplate(template)
                });
            }
            this.dialogRef.close(true);
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

    updateAccountName(value: string, formControlName: string) {
        this.templateForm.get(formControlName).setValue(this.accountsTwoWay.get(Number.parseInt(value)));
    }

    updateAccount(value: any, formControlName: string) {
        this.templateForm.get(formControlName).setValue(this.accountsTwoWay.revGet(value));
    }

    async validateAccountExists(control: AbstractControl): Promise<any> {
        return (this.accountIds.includes(Number.parseInt(control.value))) ? null : {accountDoesntExist: true};
    }

}
