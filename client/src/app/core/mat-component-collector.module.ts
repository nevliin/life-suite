import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule, MatSliderModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule
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
        MatTreeModule,
        MatDialogModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatSliderModule
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
        MatTreeModule,
        MatDialogModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatSliderModule
    ],
    declarations: []
})
export class MatComponentCollectorModule {
}
