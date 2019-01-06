import {Injectable} from '@angular/core';
import {Menu} from "./menu-structure";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    public currentMenu$: BehaviorSubject<string> = new BehaviorSubject(null);

    constructor(readonly http: HttpClient) {
    }

    public setCurrentMenu$(menu: string) {
        this.currentMenu$.next(menu);
    }

    public async getMenus() {
        const menus: Menu[] = [];
        (<Menu[]>(await this.http.get('./assets/menu.json').toPromise())).forEach((menu: Menu) => {
            if (!menu.absolute) {
                menu.menuEntries.forEach(menuEntry => menuEntry.route.unshift(menu.routeName));
            }
            menus.push(menu);
        });
        return menus;
    }

}
