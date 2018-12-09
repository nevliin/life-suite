import {Component, OnInit} from '@angular/core';
import {FinAccount} from "../fin-account";
import {FinService} from "../fin.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-fin-account-search',
    templateUrl: './fin-account-search.component.html',
    styleUrls: ['./fin-account-search.component.scss']
})
export class FinAccountSearchComponent implements OnInit {

    locale: string = "en";

    displayRecentlyUsed: boolean = true;
    listTitle: string = 'Recently Used';

    recentlyUsedAccounts: FinAccount[] = [];
    searchResults: FinAccount[] = [];

    searchTerm: string = '';

    accountsById: Map<number, FinAccount> = new Map();

    constructor(
        private readonly finService: FinService,
        private readonly router: Router
    ) {
        this.locale = navigator.language;
    }

    async ngOnInit() {
        this.finService.getRecentlyUsedAccounts().then(value => this.recentlyUsedAccounts = value.splice(0, 10));
        this.finService.getAccountsById().then(value => this.accountsById = value);
    }

    onSearch() {
        if (this.searchTerm.toLowerCase() === '') {
            this.displayRecentlyUsed = true;
            this.listTitle = "Recently Used";
            return;
        }
        this.displayRecentlyUsed = false;
        this.listTitle = "Search Results";
        if (this.accountsById.size > 0) {
            this.searchResults = Array.from(this.accountsById.values()).filter((value: FinAccount) => {
                return value.name.toLowerCase().includes(this.searchTerm.toLowerCase())
                    || value.id.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
            });
        }
    }

}
