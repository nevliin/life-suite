import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthModule} from "./auth/auth.module";
import {ErrorHandlingModule} from "./error-handling/error-handling.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    AuthModule,
    ErrorHandlingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: []
})
export class CoreModule { }
