import {MenuItem} from "primeng/api";

export class Menu {
  routeName: string;
  menuTitle: string;
  absolute?: boolean;
  menuEntries: MenuEntry[];
}

export class MenuEntry {
  label: string;
  route: string[]
}

export class DisplayMenu {
    routeName: string;
    menuTitle: string;
    menuEntries: MenuItem[];
}