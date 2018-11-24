import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {MatButtonModule, MatCardModule, MatGridListModule, MatIconModule, MatMenuModule} from "@angular/material";
import {LayoutModule} from "@angular/cdk/layout";
import { TileInvExpirationsComponent } from './tile-inv-expirations/tile-inv-expirations.component';
import { TileContainerComponent } from './tile-container/tile-container.component';
import { TileDirective } from './tile-container/tile.directive';
import {MatComponentCollectorModule} from "../core/mat-component-collector.module";
import { TileFinFiguresComponent } from './tile-fin-figures/tile-fin-figures.component';

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
    declarations: [DashboardComponent, TileInvExpirationsComponent, TileContainerComponent, TileDirective, TileFinFiguresComponent],
    entryComponents: [TileInvExpirationsComponent, TileFinFiguresComponent]
})
export class DashboardModule {
}
