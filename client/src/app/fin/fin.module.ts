import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FinDashboardComponent} from './fin-dashboard/fin-dashboard.component';
import {FinAddComponent} from './fin-add/fin-add.component';
import {FinRecentComponent} from './fin-recent/fin-recent.component';
import {FinAccountsComponent} from './fin-accounts/fin-accounts.component';
import {MatComponentCollectorModule} from "../core/mat-component-collector.module";
import { FinTransactionComponent } from './fin-transaction/fin-transaction.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ComponentsModule} from "../core/components/components.module";

@NgModule({
    imports: [
        CommonModule,
        MatComponentCollectorModule,
        FormsModule,
        ReactiveFormsModule,
        ComponentsModule
    ],
    declarations: [FinDashboardComponent, FinAddComponent, FinRecentComponent, FinAccountsComponent, FinTransactionComponent]
})
export class FinModule {
}
