import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MenuService} from "../menu.service";
import {MenuItem} from "primeng/api";
import {MenuEntry} from "../menu-structure";
import {AuthService} from "../../auth/auth.service";

@Component({
    selector: 'dynamic-menu',
    templateUrl: './dynamic-menu.component.html',
    styleUrls: ['./dynamic-menu.component.css']
})
export class DynamicMenuComponent implements OnInit {

    isVerified: boolean = false;
    menuOpen: boolean = false;
    menuTitle: string;
    menuItems: MenuItem[] = [];

    menuBarItems: MenuItem[] = [
        {
            icon: 'fa fa-bars fa-2x',
            label: '',
            command: () => this.menuOpen = !this.menuOpen
        }
    ];

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
            console.log(verified);
            return this.isVerified = verified;
        });
    }

    async logOut() {
        await this.authService.logOut();
        this.menuOpen = false;
    }

}
