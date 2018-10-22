import { Injectable } from '@angular/core';
import {Menu, MenuEntry} from "./menu-structure";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  menus: Map<string, MenuEntry[]> = undefined;
  currentMenu$: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(readonly http: HttpClient) { }

  async getCurrentMenu(): Promise<BehaviorSubject<string>> {
    if(this.menus === undefined) {
      await this.loadMenus();
    }
    return this.currentMenu$;
  }

  setCurrentMenu(currentMenu: string) {
    this.currentMenu$.next(currentMenu);
  }

  getMenuEntries(menu: string): MenuEntry[] {
    if(menu !== null) {
      return this.menus.get(menu);
    }
    return [];
  }

  async loadMenus() {
    if(!this.menus) {
      this.menus = new Map();
      (<Menu[]>(await this.http.get('./assets/menu.json').toPromise())).forEach((menu: Menu) => {
        menu.menuEntries.forEach(menuEntry => menuEntry.route.unshift(menu.routeName));
        this.menus.set(menu.routeName, menu.menuEntries);
      });
    }
  }
}
