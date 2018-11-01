import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FinDashboardComponent} from './fin-dashboard/fin-dashboard.component';
import {FinAddComponent} from './fin-add/fin-add.component';
import {FinRecentComponent} from './fin-recent/fin-recent.component';
import {FinAccountsComponent} from './fin-accounts/fin-accounts.component';
import {MatComponentCollectorModule} from "../core/mat-component-collector.module";
import { FinTransactionComponent } from './fin-transaction/fin-transaction.component';

@NgModule({
    imports: [
        CommonModule,
        MatComponentCollectorModule
    ],
    declarations: [FinDashboardComponent, FinAddComponent, FinRecentComponent, FinAccountsComponent, FinTransactionComponent]
})
export class FinModule {
}
