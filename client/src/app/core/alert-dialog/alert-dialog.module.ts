import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AlertDialogConfirmComponent} from './alert-dialog-confirm/alert-dialog-confirm.component';
import {AlertDialogService} from './alert-dialog.service';
import {MatComponentCollectorModule} from '../mat-component-collector.module';
import {AlertDialogInfoComponent} from './alert-dialog-info/alert-dialog-info.component';

@NgModule({
    imports: [
        CommonModule,
        MatComponentCollectorModule
    ],
    declarations: [AlertDialogConfirmComponent, AlertDialogInfoComponent],
    providers: [AlertDialogService],
    entryComponents: [AlertDialogConfirmComponent, AlertDialogInfoComponent]

})
export class AlertDialogModule {
}
