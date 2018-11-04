import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    MatAutocompleteModule,
    MatButtonModule, MatCardModule, MatDividerModule, MatExpansionModule, MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule, MatProgressSpinnerModule, MatSelectModule,
    MatSidenavModule,
    MatToolbarModule, MatTooltipModule, MatTreeModule
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
        MatTooltipModule,
        MatDividerModule,
        MatExpansionModule,
        MatTreeModule
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
        MatTooltipModule,
        MatDividerModule,
        MatExpansionModule,
        MatTreeModule
    ],
    declarations: []
})
export class MatComponentCollectorModule {
}
