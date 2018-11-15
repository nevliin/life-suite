import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {ButtonModule} from "primeng/button";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {MatComponentCollectorModule} from "../mat-component-collector.module";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        MatComponentCollectorModule
    ],
    declarations: [PageNotFoundComponent]
})
export class ErrorHandlingModule {
}
