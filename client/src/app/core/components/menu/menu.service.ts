import {Injectable} from '@angular/core';
import {Menu, menus} from './menu-structure';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';

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
        return menus.map((menu: Menu) => {
            if (!menu.absolute) {
                menu.menuEntries.forEach(menuEntry => {
                    if (menuEntry.route) {
                        menuEntry.route.unshift(menu.routeName);
                    }
                });
            }
            return menu;
        });
    }
}
