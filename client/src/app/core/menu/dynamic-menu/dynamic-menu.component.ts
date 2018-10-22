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
  menuEntries: MenuItem[];

  constructor(
    readonly route: ActivatedRoute,
    readonly menuService: MenuService,
    readonly router: Router
  ) {
  }

  async ngOnInit() {
    (await this.menuService.getCurrentMenu()).subscribe(value => {
      this.menuEntries = this.menuService.getMenuEntries(value).map((entry: MenuEntry): MenuItem => {
        return {
          label: entry.label,
          command: () => {
            this.router.navigate(entry.route);
          }
        }
      });
    });
  }

}
