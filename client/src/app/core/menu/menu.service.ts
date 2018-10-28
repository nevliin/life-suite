import {Injectable} from '@angular/core';
import {Menu} from "./menu-structure";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    menus: Map<string, Menu> = undefined;
    currentMenu$: BehaviorSubject<string> = new BehaviorSubject(null);

    constructor(readonly http: HttpClient) {
    }

    async getCurrentMenuRoute(): Promise<BehaviorSubject<string>> {
        if (this.menus === undefined) {
            await this.loadMenus();
        }
        return this.currentMenu$;
    }

    setCurrentMenuRoute(currentMenu: string) {
        this.currentMenu$.next(currentMenu);
    }

    getMenu(menu: string): Menu {
        if (menu !== null && this.menus.has(menu)) {
            return this.menus.get(menu);
        }
        if(this.menus.has('default')) {
            return this.menus.get('default');
        }
        return null;
    }

    async loadMenus() {
        if (!this.menus) {
            this.menus = new Map();
            (<Menu[]>(await this.http.get('./assets/menu.json').toPromise())).forEach((menu: Menu) => {
                /*if(!menu.absolute) {
                    menu.menuEntries.forEach(menuEntry => menuEntry.route.unshift(menu.routeName));
                }*/
                this.menus.set(menu.routeName, menu);
            });
        }
    }
}
