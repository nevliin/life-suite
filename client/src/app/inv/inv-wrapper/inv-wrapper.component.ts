import {Component, OnInit} from '@angular/core';
import {InvService} from '../inv.service';
import {InvStock} from '../inv-stock';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSelectChange} from '@angular/material';
import {Location} from '@angular/common';

@Component({
    selector: 'app-inv-wrapper',
    templateUrl: './inv-wrapper.component.html',
    styleUrls: ['./inv-wrapper.component.css']
})
export class InvWrapperComponent implements OnInit {

    stocks: InvStock[] | null = null;
    stockId: number | null = null;

    constructor(
        private readonly invService: InvService,
        private readonly router: Router,
        private readonly location: Location,
        private readonly route: ActivatedRoute
    ) {
        this.invService.currentStockId$.subscribe(async (value: number) => {
            if (this.stocks === null) {
                this.stocks = await this.invService.getStocks();
            }
            if (value === null || this.stocks.findIndex(stock => stock.id === value) === -1) {
                debugger;
                await this.router.navigate(['/inv']);
            }
            if (value !== this.stockId) {
                this.stockId = value;
            }
        });
    }

    ngOnInit(): void {
    }

    async switchStock($event: MatSelectChange) {
        if ($event.value !== this.stockId) {
            this.stockId = $event.value;
            const oldRoute: string[] = this.location.path().split('/');
            const newRoute = [oldRoute[1], this.stockId, {outlets: {inv: [oldRoute[3].split(':')[1].replace(')', '')]}}];
            await this.router.navigate(newRoute);
        }
    }
}
