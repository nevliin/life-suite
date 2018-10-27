import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLoginComponent } from './auth-login/auth-login.component';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import { AuthLoginWrapperComponent } from './auth-login-wrapper/auth-login-wrapper.component';
import {ButtonModule} from "primeng/button";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
      ButtonModule
  ],
  declarations: [
    AuthLoginComponent,
    AuthLoginWrapperComponent,
  ]
})
export class AuthModule { }
