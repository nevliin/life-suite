import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeDashboardComponent} from "./home-dashboard/home-dashboard.component";
import {MatButtonModule, MatCardModule, MatGridListModule, MatIconModule, MatMenuModule} from "@angular/material";
import {LayoutModule} from "@angular/cdk/layout";

@NgModule({
    imports: [
        CommonModule,
        MatGridListModule,
        MatCardModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        LayoutModule
    ],
    declarations: [HomeDashboardComponent]
})
export class HomeModule {
}
