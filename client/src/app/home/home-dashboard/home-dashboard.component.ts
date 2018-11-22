import {Component, OnInit} from '@angular/core';
import {map, startWith} from 'rxjs/operators';
import {TileInvExpirationsComponent} from "../tile-inv-expirations/tile-inv-expirations.component";
import {Tile} from "../tile";
import {ObservableMedia} from "@angular/flex-layout";
import {Observable} from "rxjs";
import {TileFinFiguresComponent} from "../tile-fin-figures/tile-fin-figures.component";

@Component({
    selector: 'app-home-dashboard',
    templateUrl: './home-dashboard.component.html',
    styleUrls: ['./home-dashboard.component.css'],
})
export class HomeDashboardComponent implements OnInit {
    public cols: Observable<number>;

    /** Based on the screen size, switch from standard to one column per row */
    tiles: Tile[] = [
        {
            title: 'INV - Expirations',
            link: ['inv', 'expirations'],
            component: TileInvExpirationsComponent,
            rowspan: 1
        },
        {
            title: 'FIN - Figures',
            link: ['fin'],
            component: TileFinFiguresComponent,
            rowspan: 1
        }
    ];


    constructor(private observableMedia: ObservableMedia) {
    }

    ngOnInit(): void {
        const grid: Map<string, number> = new Map<string, number>([
            ["xs", 1],
            ["sm", 2],
            ["md", 3],
            ["lg", 3],
            ["xl", 3]
        ]);
        let start: number;
        grid.forEach((cols, mqAlias) => {
            if (this.observableMedia.isActive(mqAlias)) {
                start = cols;
            }
        });
        this.cols = this.observableMedia.asObservable().pipe(map(change => {
                console.log(change);
                console.log(grid.get(change.mqAlias));
                return grid.get(change.mqAlias);
            }),
            startWith(start));
    }
}
