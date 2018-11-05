import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {FinAccount} from "../../fin-account";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FinService} from "../../fin.service";
import {MessageService} from "primeng/api";
import {ErrorHandlingService} from "../../../core/error-handling/error-handling.service";
import {FinCategory} from "../../fin-category";

@Component({
    selector: 'app-fin-category-add',
    templateUrl: './fin-category-add.component.html'
})
export class FinCategoryAddComponent implements OnInit {

    categoryForm: FormGroup = this.fb.group({
        categoryName: ['', Validators.required],
        active: [true]
    });

    constructor(
        public dialogRef: MatDialogRef<FinCategoryAddComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { existingCategories: string[] },
        readonly fb: FormBuilder,
        readonly finService: FinService,
        readonly messageService: MessageService,
        readonly errorHandlingService: ErrorHandlingService
    ) {
    }

    ngOnInit() {
    }

    cancel() {
        this.dialogRef.close(null);
    }

    async submit() {
        if (this.categoryForm.valid) {
            const category: FinCategory = new FinCategory();
            category.name = this.categoryForm.get('categoryName').value;
            category.active = this.categoryForm.get('active').value;
            const categoryId: number = await this.finService.createCategory(category);
            category.id = categoryId;
            try {
                this.messageService.add({
                    life: 3000,
                    summary: 'Success',
                    detail: `Category ${category.name} successfully created.`,
                    severity: '' +
                        ''
                });
                this.dialogRef.close(category);
            } catch(e) {
                this.errorHandlingService.handleHTTPError(e);
            }
        } else {
            this.messageService.add({life: 3000, summary: 'Warn', detail: 'Form invalid.'});
        }
    }

}
