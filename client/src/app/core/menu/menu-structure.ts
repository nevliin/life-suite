import {MenuItem} from 'primeng/api';
import {AbstractMenuEntryCommand} from './abstract-menu-entry-command';
import {Location} from '@angular/common';
import {LOCAL_STORAGE_STOCK_TOKEN} from '../../inv/inv.service';

export class Menu {
    routeName: string;
    menuTitle: string;
    absolute?: boolean;
    menuEntries: MenuEntry[];
}

export class MenuEntry {
    label: string;
    route?: string[];
    command?: AbstractMenuEntryCommand;
}

export class DisplayMenu {
    routeName: string;
    menuTitle: string;
    menuEntries: MenuItem[];
}

export const menus: Menu[] = [
    {
        routeName: 'inv',
        menuTitle: 'Inventory',
        menuEntries: [
            {
                label: 'Stocks',
                route: []
            },
            {
                label: 'List',
                command: {
                    onMenuEntryClick(location: Location) {
                        return newInvRoute(location, 'list');
                    }
                }
            },
            {
                label: 'Comparison',
                command: {
                    onMenuEntryClick(location: Location) {
                        return newInvRoute(location, 'comparison');
                    }
                }
            },
            {
                label: 'Target',
                command: {
                    onMenuEntryClick(location: Location) {
                        return newInvRoute(location, 'target');
                    }
                }
            },
            {
                label: 'Expirations',
                command: {
                    onMenuEntryClick(location: Location) {
                        return newInvRoute(location, 'expirations');
                    }
                }
            },
            {
                label: 'Add Entry',
                command: {
                    onMenuEntryClick(location: Location) {
                        return newInvRoute(location, 'add');
                    }
                }
            }
        ]
    },
    {
        routeName: 'fin',
        menuTitle: 'Financials',
        menuEntries: [
            {
                label: 'Dashboard',
                route: [
                    'dashboard'
                ]
            },
            {
                label: 'Add Transaction',
                route: [
                    'add'
                ]
            },
            {
                label: 'Recent Transactions',
                route: [
                    'recent'
                ]
            },
            {
                label: 'Account Search',
                route: [
                    'account-search'
                ]
            },
            {
                label: 'Account Tree',
                route: [
                    'accounts'
                ]
            }
        ]
    }
];

function newInvRoute(location: Location, subroute: string): any[] {
    const oldRoute: string[] = location.path().split('/');
    if (oldRoute[1] === 'inv' && oldRoute[2] !== undefined) {
        return [oldRoute[1], oldRoute[2], {outlets: {inv: [subroute]}}];
    }
    const stockId: string = localStorage.getItem(LOCAL_STORAGE_STOCK_TOKEN);
    if (stockId) {
        return ['inv', stockId, {outlets: {inv: [subroute]}}];
    }
    return ['inv'];
}


