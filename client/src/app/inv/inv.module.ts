import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InvListComponent} from './inv-list/inv-list.component';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InvComparisonComponent} from './inv-comparison/inv-comparison.component';
import {PipesModule} from '../core/pipes/pipes.module';
import {InvTargetComponent} from './inv-target/inv-target.component';
import {InvExpirationsComponent} from './inv-expirations/inv-expirations.component';
import {InvAddComponent} from './inv-add/inv-add.component';
import {InvService} from './inv.service';
import {InvStockListComponent} from './inv-stock-list/inv-stock-list.component';
import {MatComponentCollectorModule} from '../core/mat-component-collector.module';
import { InvWrapperComponent } from './inv-wrapper/inv-wrapper.component';
import {RouterModule} from '@angular/router';
import {CurrentStockResolver} from './current-stock.resolver';

@NgModule({
    imports: [
        CommonModule,
        DropdownModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        PipesModule,
        MatComponentCollectorModule,
        RouterModule
    ],
    declarations: [
        InvListComponent,
        InvComparisonComponent,
        InvTargetComponent,
        InvTargetComponent,
        InvExpirationsComponent,
        InvAddComponent,
        InvStockListComponent,
        InvWrapperComponent
    ],
    providers: [InvService, CurrentStockResolver]
})
export class InvModule {
}
