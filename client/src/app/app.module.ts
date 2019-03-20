import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {AuthModule} from './core/auth/auth.module';
import {InvModule} from './inv/inv.module';
import {CoreModule} from './core/core.module';
import {DynamicMenuModule} from './core/components/menu/dynamic-menu.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ComponentsModule} from './core/components/components.module';
import {DashboardModule} from './dashboard/dashboard.module';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {ErrorHandlingService} from './core/error-handling/error-handling.service';
import {ErrorHandlingModule} from './core/error-handling/error-handling.module';
import {FinModule} from './fin/fin.module';
import {AppRouting} from './app.routing';
import {FlexLayoutModule} from '@angular/flex-layout';
import {LayoutModule} from '@angular/cdk/layout';

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
        FlexLayoutModule,
        LayoutModule
    ],
    providers: [MessageService, ErrorHandlingService, { provide: LOCALE_ID, useFactory: () => navigator.language }],
    bootstrap: [AppComponent]
})
export class AppModule {
}
