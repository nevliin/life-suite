import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthModule} from './auth/auth.module';
import {ErrorHandlingModule} from './error-handling/error-handling.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PipesModule} from '../util/pipes/pipes.module';
import {DynamicMenuModule} from './components/menu/dynamic-menu.module';
import {ComponentsModule} from './components/components.module';
import {UserModule} from './user/user.module';

@NgModule({
    imports: [
        CommonModule,
        AuthModule,
        ErrorHandlingModule,
        FormsModule,
        ReactiveFormsModule,
        PipesModule,
        DynamicMenuModule,
        ComponentsModule,
        UserModule
    ],
    declarations: []
})
export class CoreModule {
}
