import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {RouterModule} from "@angular/router";
import {AppRouting} from "./app.routing";
import {HttpClientModule} from "@angular/common/http";
import {AuthModule} from "./core/auth/auth.module";
import {InvModule} from "./inv/inv.module";
import {CoreModule} from "./core/core.module";
import {MenuModule} from "./core/menu/menu.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    MenuModule,
    RouterModule,
    AppRouting,
    HttpClientModule,
    AuthModule,
    InvModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
