import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvListComponent } from './inv-list/inv-list.component';
import {DropdownModule} from "primeng/dropdown";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  declarations: [InvListComponent]
})
export class InvModule { }
