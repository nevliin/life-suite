import {Component, OnInit} from '@angular/core';
import {InvStock} from '../inv-stock';
import {InvService} from '../inv.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-inv-stock-list',
    templateUrl: './inv-stock-list.component.html',
    styleUrls: ['./inv-stock-list.component.css']
})
export class InvStockListComponent implements OnInit {

    stocks: InvStock[] = [];

    constructor(
        private readonly invService: InvService,
        private readonly router: Router
    ) {
    }

    async ngOnInit() {
        this.stocks = await this.invService.getStocks();
    }

}
