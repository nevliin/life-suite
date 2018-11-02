import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    MatAutocompleteModule,
    MatButtonModule, MatCardModule, MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule, MatProgressSpinnerModule,
    MatSidenavModule,
    MatToolbarModule
} from "@angular/material";

@NgModule({
    imports: [
        CommonModule,
        MatSidenavModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatCardModule,
        MatFormFieldModule,
        MatAutocompleteModule
    ],
    exports: [
        MatSidenavModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatCardModule,
        MatFormFieldModule,
        MatAutocompleteModule
    ],
    declarations: []
})
export class MatComponentCollectorModule {
}
