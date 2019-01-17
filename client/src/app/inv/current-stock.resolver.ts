import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {InvService} from './inv.service';

@Injectable()
export class TransactionResolver implements Resolve<any> {

    constructor(
        private invService: InvService
    ) {
    }

    resolve(route: ActivatedRouteSnapshot) {
        this.invService.currentStockId$.next(route.params.stockId);
    }
}
