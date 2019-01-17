import {Component, OnInit} from '@angular/core';
import {InvService} from '../inv.service';
import {InvStock} from '../inv-stock';

@Component({
    selector: 'app-inv-wrapper',
    templateUrl: './inv-wrapper.component.html',
    styleUrls: ['./inv-wrapper.component.css']
})
export class InvWrapperComponent implements OnInit {

    stocks: InvStock[] = [];

    constructor(
        private readonly invService: InvService
    ) {
    }

    async ngOnInit() {
        this.stocks = await this.invService.getStocks();
    }
}
