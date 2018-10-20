import { Injectable } from '@angular/core';
import {Menu, MenuEntry} from "./menu-structure";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  menus: Map<string, MenuEntry[]> = undefined;
  currentMenu: string;

  constructor(readonly http: HttpClient) { }

  async getCurrentMenu(): Promise<MenuEntry[]> {
    await this.loadMenus();
    return this.menus.get(this.currentMenu);
  }

  setCurrentMenu(currentMenu: string) {
    this.currentMenu = currentMenu;
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
