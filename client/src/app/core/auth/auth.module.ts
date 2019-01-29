import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthLoginComponent} from './auth-login/auth-login.component';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AuthLoginWrapperComponent} from './auth-login-wrapper/auth-login-wrapper.component';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule, MessagesModule} from 'primeng/primeng';
import {MatComponentCollectorModule} from '../mat-component-collector.module';
import {UserDetailsComponent} from '../user/user-details/user-details.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        ButtonModule,
        MessagesModule,
        CheckboxModule,
        MatComponentCollectorModule
    ],
    declarations: [
        AuthLoginComponent,
        AuthLoginWrapperComponent
    ]
})
export class AuthModule {
}
