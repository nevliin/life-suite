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
