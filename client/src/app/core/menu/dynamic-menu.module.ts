import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DynamicMenuComponent} from './dynamic-menu/dynamic-menu.component';
import {RouterModule} from "@angular/router";
import {ButtonModule, InputTextModule, MenubarModule, MenuModule, SidebarModule} from "primeng/primeng";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        SidebarModule,
        MenuModule,
        MenubarModule,
        ButtonModule,
        InputTextModule,

    ],
    declarations: [DynamicMenuComponent],
    exports: [DynamicMenuComponent]
})
export class DynamicMenuModule {
}
