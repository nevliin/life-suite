import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {FinAccount} from "../../fin-account";
import {FinService} from "../../fin.service";
import {MessageService} from "primeng/api";
import {ErrorHandlingService} from "../../../core/error-handling/error-handling.service";

@Component({
    selector: 'app-fin-account-add',
    templateUrl: './fin-account-add.component.html'
})
export class FinAccountAddComponent implements OnInit {

    title: string = 'Add';

    accountForm: FormGroup = this.fb.group({
        categoryId: [],
        parentAccountId: [],
        accountId: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]{1,4}')])],
        accountName: ['', Validators.required],
        accountNote: ['']
    });

    constructor(
        public dialogRef: MatDialogRef<FinAccountAddComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { existingAccounts: number[], new: boolean, initialData: FinAccount },
        readonly fb: FormBuilder,
        readonly finService: FinService,
        readonly messageService: MessageService,
        readonly errorHandlingService: ErrorHandlingService
    ) {
        if (!this.data.new) {
            this.title = 'Edit';
            this.accountForm.get('categoryId').setValue(this.data.initialData.category_id);
            this.accountForm.get('parentAccountId').setValue(this.data.initialData.parent_account);
            this.accountForm.get('accountId').setValue(this.data.initialData.id);
            this.accountForm.get('accountName').setValue(this.data.initialData.name);
            this.accountForm.get('accountNote').setValue(this.data.initialData.note);
        } else {
            this.accountForm.get('categoryId').setValue(this.data.initialData.category_id);
            this.accountForm.get('parentAccountId').setValue(this.data.initialData.parent_account);
            this.accountForm.get('accountId').setValue(this.data.initialData.parent_account);
        }
    }

    ngOnInit() {
    }

    cancel() {
        this.dialogRef.close(null);
    }

    async submit() {
        debugger;
        if (this.accountForm.valid) {
            const account: FinAccount = new FinAccount();
            account.category_id = Number.parseInt(this.accountForm.get('categoryId').value);
            account.parent_account = Number.parseInt(this.accountForm.get('parentAccountId').value);
            account.id = Number.parseInt(this.accountForm.get('accountId').value);
            account.name = this.accountForm.get('accountName').value;
            account.note = this.accountForm.get('accountNote').value;
            account.deactivated = false;
            try {
                if (this.data.new) {
                    await this.finService.createAccount(account);
                } else {
                    await this.finService.updateAccount(account);
                }
                this.messageService.add({
                    life: 3000,
                    summary: 'Success',
                    detail: `Account '${account.id} / ${account.name}' successfully ${(this.data.new) ? 'created' : 'updated'}.`,
                    severity: 'success'
                });
                this.dialogRef.close(account);
            } catch (e) {
                this.errorHandlingService.handleHTTPError(e);
            }
        } else {
            this.messageService.add({life: 3000, summary: 'Warn', detail: 'Form invalid.'});
        }
    }

}
