import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {ButtonModule, InputTextModule, MenubarModule, MenuModule, SidebarModule} from "primeng/primeng";
import { DynamicSidenavComponent } from './dynamic-sidenav/dynamic-sidenav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        SidebarModule,
        MenuModule,
        MenubarModule,
        ButtonModule,
        InputTextModule,
        LayoutModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,

    ],
    declarations: [DynamicSidenavComponent],
    exports: [DynamicSidenavComponent]
})
export class DynamicMenuModule {
}
