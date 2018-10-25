import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {MenuService} from "./menu.service";

@Injectable({
  providedIn: 'root'
})
export class CurrentMenuResolver implements Resolve<any> {

  constructor(readonly menuService: MenuService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log(route.url[0].path);
    this.menuService.setCurrentMenuRoute(route.url[0].path);
  }
}
