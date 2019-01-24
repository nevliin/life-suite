import {Component} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';
import {MenuService} from '../menu.service';
import {AuthService} from '../../auth/auth.service';
import {DisplayMenu, Menu, MenuEntry} from '../menu-structure';
import {Location} from '@angular/common';

@Component({
    selector: 'dynamic-sidenav',
    templateUrl: './dynamic-sidenav.component.html',
    styleUrls: ['./dynamic-sidenav.component.css'],
})
export class DynamicSidenavComponent {

    expansionStatus: any = {};

    isVerified: boolean = false;
    menus: DisplayMenu[] = [];

    constructor(
        readonly route: ActivatedRoute,
        readonly menuService: MenuService,
        readonly router: Router,
        readonly authService: AuthService,
        private readonly location: Location
    ) {
    }

    async ngOnInit() {
        this.menus = (await this.menuService.getMenus()).map((menu: Menu) => {
            return {
                menuTitle: menu.menuTitle,
                routeName: menu.routeName,
                menuEntries: menu.menuEntries.map((entry: MenuEntry): MenuItem => {
                    return {
                        label: entry.label,
                        command: () => {
                            if (entry.command) {
                                this.router.navigate(entry.command.onMenuEntryClick(this.location)).then();
                                return;
                            }
                            this.router.navigate(entry.route).then();
                        }
                    };
                })
            };
        });
        this.menus.forEach((menu: DisplayMenu) => {
            this.expansionStatus[menu.routeName] = false;
        });
        this.menuService.currentMenu$.subscribe((currentMenu: string) => {
            Object.entries(this.expansionStatus).forEach((value: [string, any]) => {
                this.expansionStatus[value[0]] = value[0] === currentMenu;
            });
        });
        this.authService.getVerification$().subscribe((verified: boolean) => {
            return this.isVerified = verified;
        });
    }

    async logOut() {
        await this.authService.logOut();
    }
}
