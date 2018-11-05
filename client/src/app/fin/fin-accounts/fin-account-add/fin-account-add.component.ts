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

    accountForm: FormGroup = this.fb.group({
        categoryId: [],
        parentAccountId: [],
        accountId: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]{4}')])],
        accountName: ['', Validators.required],
        accountNote: ['']
    });

    constructor(
        public dialogRef: MatDialogRef<FinAccountAddComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { account: FinAccount, existingAccounts: number[] },
        readonly fb: FormBuilder,
        readonly finService: FinService,
        readonly messageService: MessageService,
        readonly errorHandlingService: ErrorHandlingService
    ) {
        this.accountForm.get('categoryId').setValue(this.data.account.category_id);
        this.accountForm.get('parentAccountId').setValue(this.data.account.parent_account);
        this.accountForm.get('accountId').setValue(this.data.account.parent_account);
    }

    ngOnInit() {
    }

    cancel() {
        this.dialogRef.close(null);
    }

    async submit() {
        if (this.accountForm.valid) {
            const account: FinAccount = new FinAccount();
            account.category_id = Number.parseInt(this.accountForm.get('categoryId').value);
            account.parent_account = Number.parseInt(this.accountForm.get('parentAccountId').value);
            account.id = Number.parseInt(this.accountForm.get('accountId').value);
            account.name = this.accountForm.get('accountName').value;
            account.note = this.accountForm.get('accountNote').value;
            await this.finService.createAccount(account);
            try {
                this.messageService.add({
                    life: 3000,
                    summary: 'Success',
                    detail: `Category ${account.id} / ${account} successfully created.`,
                    severity: 'success'
                });
                this.dialogRef.close(account);
            } catch(e) {
                this.errorHandlingService.handleHTTPError(e);
            }
        } else {
            this.messageService.add({life: 3000, summary: 'Warn', detail: 'Form invalid.'});
        }
    }

}
