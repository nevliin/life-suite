import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogWrapperComponent} from './dialog-wrapper/dialog-wrapper.component';
import {DialogModule} from "primeng/dialog";

@NgModule({
    imports: [
        CommonModule,
        DialogModule
    ],
    declarations: [DialogWrapperComponent],
    exports: [DialogWrapperComponent]
})
export class ComponentsModule {
}
