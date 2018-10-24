export class Menu {
  routeName: string;
  menuTitle: string;
  menuEntries: MenuEntry[];
}

export class MenuEntry {
  label: string;
  route: string[]
}
