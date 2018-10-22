import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicMenuComponent } from './dynamic-menu/dynamic-menu.component';
import {RouterModule} from "@angular/router";
import {MenuModule, SidebarModule} from "primeng/primeng";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SidebarModule,
    MenuModule
  ],
  declarations: [DynamicMenuComponent],
  exports: [DynamicMenuComponent]
})
export class DynamicMenuModule { }
