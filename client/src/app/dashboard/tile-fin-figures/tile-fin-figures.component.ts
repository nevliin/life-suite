import {Component, EventEmitter, OnInit} from '@angular/core';
import {FinService} from "../../fin/fin.service";
import {OnTileLoadingDone} from "../tile-container/on-tile-loading-done";

const expensesCategoryId: number = 3;
const revenueCategoryId: number = 6;

@Component({
    selector: 'app-tile-fin-figures',
    templateUrl: './tile-fin-figures.component.html',
    styleUrls: ['./tile-fin-figures.component.css']
})
export class TileFinFiguresComponent implements OnInit, OnTileLoadingDone {

    expenses: number = 0;
    revenue: number = 0;
    profit: number = 0;
    totalTransactionAmount: number = 0;
    loadingDone: EventEmitter<boolean> = new EventEmitter();

    constructor(
        readonly finService: FinService
    ) {
    }

    async ngOnInit() {
        await Promise.all([
            Promise.all(
                [
                    this.finService.getCategoryTotal(expensesCategoryId, new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1))
                        .then((value) => this.expenses = value),
                    this.finService.getCategoryTotal(revenueCategoryId, new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1))
                        .then((value) => this.revenue = value)
                ]
            ).then(() => this.profit = this.revenue - this.expenses),
            this.finService.getAllTransactionsAmount(new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1))
                .then((value) => this.totalTransactionAmount = value)
        ]);
        this.loadingDone.emit(true);
    }

}
