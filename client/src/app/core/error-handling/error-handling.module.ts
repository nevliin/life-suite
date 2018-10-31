import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {RouterModule} from "@angular/router";
import {ButtonModule} from "primeng/button";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule
    ],
    declarations: [PageNotFoundComponent]
})
export class ErrorHandlingModule {
}
