import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthModule} from "./auth/auth.module";
import {ErrorHandlingModule} from "./error-handling/error-handling.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PipesModule} from "./pipes/pipes.module";
import {MenuModule} from "./menu/menu.module";

@NgModule({
  imports: [
    CommonModule,
    AuthModule,
    ErrorHandlingModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    MenuModule
  ],
  declarations: []
})
export class CoreModule { }
