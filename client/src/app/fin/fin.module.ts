import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FinDashboardComponent} from './fin-dashboard/fin-dashboard.component';
import {FinTransactionEditComponent} from './fin-transaction-edit/fin-transaction-edit.component';
import {FinRecentComponent} from './fin-recent/fin-recent.component';
import {FinAccountsComponent} from './fin-accounts/fin-accounts.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ComponentsModule} from "../core/components/components.module";
import {FinAccountAddComponent} from "./fin-accounts/fin-account-add/fin-account-add.component";
import {FinCategoryAddComponent} from './fin-accounts/fin-category-add/fin-category-add.component';
import {AlertDialogModule} from "../core/alert-dialog/alert-dialog.module";
import {MatComponentCollectorModule} from "../core/mat-component-collector.module";
import {FinService} from "./fin.service";
import {FinAccountSearchComponent} from './fin-account-search/fin-account-search.component';
import {FinAccountDetailComponent} from './fin-account-detail/fin-account-detail.component';
import {PipesModule} from "../core/pipes/pipes.module";
import {ChartModule} from "primeng/chart";
import {MatDatepickerModule, MatNativeDateModule} from "@angular/material";

@NgModule({
    imports: [
        CommonModule,
        MatComponentCollectorModule,
        FormsModule,
        ReactiveFormsModule,
        ComponentsModule,
        AlertDialogModule,
        PipesModule,
        ChartModule,
        MatDatepickerModule,
        MatNativeDateModule
    ],
    declarations: [
        FinDashboardComponent,
        FinTransactionEditComponent,
        FinRecentComponent,
        FinAccountsComponent,
        FinAccountAddComponent,
        FinCategoryAddComponent,
        FinAccountSearchComponent,
        FinAccountDetailComponent
    ],
    entryComponents: [FinAccountAddComponent, FinCategoryAddComponent, FinTransactionEditComponent, FinTransactionEditComponent],
    providers: [FinService]
})
export class FinModule {
}
