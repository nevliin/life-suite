import {Component} from '@angular/core';
import {map} from 'rxjs/operators';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {TileInvExpirationsComponent} from "../tile-inv-expirations/tile-inv-expirations.component";
import {Tile} from "../tile";

@Component({
    selector: 'app-home-dashboard',
    templateUrl: './home-dashboard.component.html',
    styleUrls: ['./home-dashboard.component.css'],
})
export class HomeDashboardComponent {
    /** Based on the screen size, switch from standard to one column per row */
    tiles: Tile[] = [
        {
            title: 'INV - Expirations',
            link: ['inv', 'expirations'],
            component: TileInvExpirationsComponent,
            rowspan: 1
        }
    ];


    constructor() {
    }
}
