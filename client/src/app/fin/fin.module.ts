import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FinDashboardComponent} from './fin-dashboard/fin-dashboard.component';
import {FinAddComponent} from './fin-add/fin-add.component';
import {FinRecentComponent} from './fin-recent/fin-recent.component';
import {FinAccountsComponent} from './fin-accounts/fin-accounts.component';
import {MatComponentCollectorModule} from "../core/mat-component-collector.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ComponentsModule} from "../core/components/components.module";
import {FinAccountAddComponent} from "./fin-accounts/fin-account-add/fin-account-add.component";
import { FinCategoryAddComponent } from './fin-accounts/fin-category-add/fin-category-add.component';
import {AlertDialogModule} from "../core/alert-dialog/alert-dialog.module";
@NgModule({
    imports: [
        CommonModule,
        MatComponentCollectorModule,
        FormsModule,
        ReactiveFormsModule,
        ComponentsModule,
        AlertDialogModule
    ],
    declarations: [FinDashboardComponent, FinAddComponent, FinRecentComponent, FinAccountsComponent, FinAccountAddComponent, FinCategoryAddComponent],
    entryComponents: [FinAccountAddComponent, FinCategoryAddComponent]
})
export class FinModule {
}
