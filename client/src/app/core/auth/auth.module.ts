import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLoginComponent } from './auth-login/auth-login.component';
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    AuthLoginComponent,
  ]
})
export class AuthModule { }
