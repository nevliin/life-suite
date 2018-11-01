import {Component} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MenuItem} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {MenuService} from "../menu.service";
import {AuthService} from "../../auth/auth.service";
import {MenuEntry} from "../menu-structure";

@Component({
    selector: 'dynamic-sidenav',
    templateUrl: './dynamic-sidenav.component.html',
    styleUrls: ['./dynamic-sidenav.component.css'],
})
export class DynamicSidenavComponent {

    isVerified: boolean = false;
    menuTitle: string;
    menuItems: MenuItem[] = [];

    constructor(
        readonly route: ActivatedRoute,
        readonly menuService: MenuService,
        readonly router: Router,
        readonly authService: AuthService
    ) {
    }

    async ngOnInit() {
        (await this.menuService.getCurrentMenuRoute()).subscribe(value => {
            if (value !== null) {
                this.menuTitle = this.menuService.getMenu(value).menuTitle;
                this.menuItems = this.menuService.getMenu(value).menuEntries.map((entry: MenuEntry): MenuItem => {
                    return {
                        label: entry.label,
                        command: () => {
                            this.router.navigate(entry.route);
                        }
                    }
                });
            }
        });
        this.authService.getVerification$().subscribe((verified: boolean) => {
            return this.isVerified = verified;
        });
    }

    async logOut() {
        await this.authService.logOut();
    }

}
