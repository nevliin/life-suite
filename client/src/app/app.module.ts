import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule} from "@angular/router";
import {AppRouting} from "./app.routing";
import {HttpClientModule} from "@angular/common/http";
import {AuthModule} from "./core/auth/auth.module";
import {InvModule} from "./inv/inv.module";
import {CoreModule} from "./core/core.module";
import {DynamicMenuModule} from "./core/menu/dynamic-menu.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        CoreModule,
        DynamicMenuModule,
        RouterModule,
        AppRouting,
        HttpClientModule,
        AuthModule,
        InvModule,
        BrowserAnimationsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
