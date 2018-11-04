import {Component, Injectable, OnInit} from '@angular/core';
import {FinCategory} from "../fin-category";
import {FinService} from "../fin.service";
import {FinAccount} from "../fin-account";
import {BehaviorSubject} from "rxjs";
import {NestedTreeControl} from "@angular/cdk/tree";
import {MatTreeNestedDataSource} from "@angular/material";

export class AccountNode {
    children: AccountNode[];
    account: FinAccount;
}

export class AccountDatabase {
    dataChange: BehaviorSubject<AccountNode[]> = new BehaviorSubject<AccountNode[]>([]);

    get data(): AccountNode[] {
        return this.dataChange.value
    };

    constructor(accounts: FinAccount[]) {
        this.dataChange.next(this.buildAccountTree(accounts, null));
    }

    buildAccountTree(accounts: FinAccount[], accountId: number): AccountNode[] {
        return accounts
            .filter((account: FinAccount) => account.parent_account === accountId)
            .map((account: FinAccount) => {
                return {
                    children: this.buildAccountTree(accounts, account.id),
                    account: account
                }
            });
    }
}

@Component({
    selector: 'app-fin-accounts',
    templateUrl: './fin-accounts.component.html',
    styleUrls: ['./fin-accounts.component.css']
})
export class FinAccountsComponent implements OnInit {
    categories: FinCategory[] = [];
    accounts: FinAccount[] = [];

    database: Map<number, AccountTreeWrapper> = new Map();

    constructor(
        readonly finService: FinService
    ) {
    }

    async ngOnInit() {
        this.categories = await this.finService.getCategories();
        this.accounts = await this.finService.getAccounts();
        this.categories.forEach((category: FinCategory) => {
            const categoryAccounts: FinAccount[] = this.accounts.filter((account: FinAccount) => account.category_id === category.id);
            this.database.set(category.id, new AccountTreeWrapper(new AccountDatabase(categoryAccounts)));
        });
    }

    hasNestedChild(_: number, nodeData: AccountNode): boolean {
        if(!nodeData || !nodeData.children) {
            return false;
        }
        console.log(nodeData.children);
        return nodeData.children.length > 0;
    }

}

class AccountTreeWrapper {
    database: AccountDatabase;
    nestedTreeControl: NestedTreeControl<AccountNode> = new NestedTreeControl<AccountNode>(this._getChildren);
    nestedDataSource: MatTreeNestedDataSource<AccountNode> = new MatTreeNestedDataSource();

    constructor(database: AccountDatabase) {
        this.database = database;
        this.database.dataChange.subscribe(data => this.nestedDataSource.data = data);
    }

    private _getChildren(node: AccountNode): AccountNode[] {
        return node.children;
    }
}
