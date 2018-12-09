import {Component, OnInit} from '@angular/core';
import {FinAccount} from "../fin-account";
import {FinService} from "../fin.service";
import {FinTransaction} from "../fin-transaction";

@Component({
    selector: 'app-fin-account-search',
    templateUrl: './fin-account-search.component.html',
    styleUrls: ['./fin-account-search.component.scss']
})
export class FinAccountSearchComponent implements OnInit {

    locale: string = "en";

    displayType: DisplayTypes = DisplayTypes.LIST;
    displayRecentlyUsed: boolean = true;
    listTitle: string = 'Recently Used';

    recentlyUsedAccounts: FinAccount[] = [];
    searchResults: FinAccount[] = [];
    detailAccount: FinAccount = null;
    detailAccountTransactions: any[] = [];

    searchTerm: string = '';

    accountsById: Map<number, FinAccount> = new Map();

    constructor(
        private readonly finService: FinService
    ) {
        this.locale = navigator.language;
    }

    async ngOnInit() {
        this.finService.getRecentlyUsedAccounts().then(value => this.recentlyUsedAccounts = value.splice(0, 10));
        this.finService.getAccountsById().then(value => this.accountsById = value);
    }

    displayList() {
        if (this.displayRecentlyUsed) {
            this.listTitle = 'Recently Used';
        }
        this.displayType = DisplayTypes.LIST;
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
                return value.name.includes(this.searchTerm) || value.id.toString().includes(this.searchTerm)
            });
        }
    }

    async displayDetail(account: FinAccount) {
        this.displayType = DisplayTypes.DETAIL;
        this.detailAccount = account;
        const from: Date = new Date();
        from.setMonth(from.getMonth() - 1);
        this.detailAccountTransactions = (await this.finService.getTransactionsByAccount(account.id, from))
            .map((value: FinTransaction) => {
                const result: any[] = [];
                if(value.account !== account.id) {
                    result[0] = value;
                }
                if(value.contra_account !== account.id) {
                    result[1] = value;
                }
                return result;
            });
    }

}

export enum DisplayTypes {
    LIST = 'LIST',
    DETAIL = 'DETAIL'
}