import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {InvService} from './inv.service';

@Injectable()
export class CurrentStockResolver implements Resolve<any> {

    constructor(
        private invService: InvService
    ) {
    }

    resolve(route: ActivatedRouteSnapshot) {
        debugger;
        this.invService.currentStockId$.next(Number(route.params.stockId));
    }
}
