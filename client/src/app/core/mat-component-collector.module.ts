import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    MatAutocompleteModule,
    MatButtonModule, MatCardModule, MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule, MatProgressSpinnerModule, MatSelectModule,
    MatSidenavModule,
    MatToolbarModule, MatTooltipModule
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
        MatAutocompleteModule,
        MatSelectModule,
        MatTooltipModule
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
        MatAutocompleteModule,
        MatSelectModule,
        MatTooltipModule
    ],
    declarations: []
})
export class MatComponentCollectorModule {
}
