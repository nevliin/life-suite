import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Menu, MenuEntry} from "./menu-structure";
import {Observable} from "rxjs";
import {MenuService} from "./menu.service";

@Injectable({
  providedIn: 'root'
})
export class CurrentMenuResolver implements Resolve<any> {

  constructor(readonly menuService: MenuService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.menuService.setCurrentMenu(route.url[0].path);
  }
}
