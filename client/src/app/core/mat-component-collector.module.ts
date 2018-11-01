import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
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
    ],
    declarations: []
})
export class MatComponentCollectorModule {
}
