import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MenuService} from "../menu.service";
import {MenuItem} from "primeng/api";
import {MenuEntry} from "../menu-structure";

@Component({
    selector: 'dynamic-menu',
    templateUrl: './dynamic-menu.component.html',
    styleUrls: ['./dynamic-menu.component.css']
})
export class DynamicMenuComponent implements OnInit {

    menuOpen: boolean = false;
    menuTitle: string;
    menuItems: MenuItem[] = [];

    menuBarItems: MenuItem[] = [
        {
            icon: '../../../../assets/menu_icon.svg',
            label: '',
            command: () => this.menuOpen = !this.menuOpen
        }
    ];

    constructor(
        readonly route: ActivatedRoute,
        readonly menuService: MenuService,
        readonly router: Router
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
    }

}
