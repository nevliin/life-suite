import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MenuService} from "../menu.service";
import {MenuEntry} from "../menu-structure";
import {map} from "rxjs/operators";

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {

  menuOpen: boolean = false;
  menuEntries: MenuEntry[];

  constructor(
    readonly route: ActivatedRoute,
    readonly menuService: MenuService
  ) {
  }

  async ngOnInit() {
    this.menuEntries = await this.menuService.getCurrentMenu();
  }

}
