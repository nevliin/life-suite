import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {AuthModule} from "./core/auth/auth.module";
import {InvModule} from "./inv/inv.module";
import {CoreModule} from "./core/core.module";
import {DynamicMenuModule} from "./core/menu/dynamic-menu.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ComponentsModule} from "./core/components/components.module";
import {DashboardModule} from "./dashboard/dashboard.module";
import {MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";
import {ErrorHandlingService} from "./core/error-handling/error-handling.service";
import {ErrorHandlingModule} from "./core/error-handling/error-handling.module";
import {FinModule} from "./fin/fin.module";
import {AppRouting} from "./app.routing";
import {FlexLayoutModule} from "@angular/flex-layout";

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
        BrowserAnimationsModule,
        ComponentsModule,
        DashboardModule,
        ToastModule,
        ErrorHandlingModule,
        FinModule,
        FlexLayoutModule
    ],
    providers: [MessageService, ErrorHandlingService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
