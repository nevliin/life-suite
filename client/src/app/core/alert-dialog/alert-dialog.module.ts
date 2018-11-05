import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AlertDialogConfirmComponent} from './alert-dialog-confirm/alert-dialog-confirm.component';
import {AlertDialogService} from "./alert-dialog.service";
import {MatComponentCollectorModule} from "../mat-component-collector.module";

@NgModule({
    imports: [
        CommonModule,
        MatComponentCollectorModule
    ],
    declarations: [AlertDialogConfirmComponent],
    providers: [AlertDialogService],
    entryComponents: [AlertDialogConfirmComponent]

})
export class AlertDialogModule {
}
