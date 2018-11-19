import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeDashboardComponent} from "./home-dashboard/home-dashboard.component";
import {MatButtonModule, MatCardModule, MatGridListModule, MatIconModule, MatMenuModule} from "@angular/material";
import {LayoutModule} from "@angular/cdk/layout";
import { TileInvExpirationsComponent } from './tile-inv-expirations/tile-inv-expirations.component';
import { AdTileComponent } from './ad-tile/ad-tile.component';
import { AdDirective } from './ad-tile/ad.directive';
import {MatComponentCollectorModule} from "../core/mat-component-collector.module";

@NgModule({
    imports: [
        CommonModule,
        MatGridListModule,
        MatCardModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        LayoutModule,
        MatComponentCollectorModule
    ],
    declarations: [HomeDashboardComponent, TileInvExpirationsComponent, AdTileComponent, AdDirective],
    entryComponents: [TileInvExpirationsComponent]
})
export class HomeModule {
}
