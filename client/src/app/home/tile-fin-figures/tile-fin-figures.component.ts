import {Component, OnInit} from '@angular/core';
import {FinService} from "../../fin/fin.service";

const expensesCategoryId: number = 3;
const revenueCategoryId: number = 6;

@Component({
    selector: 'app-tile-fin-figures',
    templateUrl: './tile-fin-figures.component.html',
    styleUrls: ['./tile-fin-figures.component.css']
})
export class TileFinFiguresComponent implements OnInit {

    private expenses: number = 0;
    private revenue: number = 0;
    private profit: number = 0;

    constructor(
        readonly finService: FinService
    ) {
    }

    async ngOnInit() {
        this.expenses = await this.finService.getCategoryTotal(expensesCategoryId, new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1));
        this.revenue = await this.finService.getCategoryTotal(revenueCategoryId, new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1));
        this.profit = this.revenue - this.expenses;
    }

}
