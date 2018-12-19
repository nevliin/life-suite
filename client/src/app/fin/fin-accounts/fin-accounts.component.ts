import {Component, OnInit} from '@angular/core';
import {FinCategory} from "../fin-category";
import {FinService} from "../fin.service";
import {FinAccount} from "../fin-account";
import {BehaviorSubject} from "rxjs";
import {NestedTreeControl} from "@angular/cdk/tree";
import {MatDialog, MatTreeNestedDataSource} from "@angular/material";
import {isNullOrUndefined} from "../../core/util";
import {FinAccountAddComponent} from "./fin-account-add/fin-account-add.component";
import {FinCategoryAddComponent} from "./fin-category-add/fin-category-add.component";
import {AlertDialogService} from "../../core/alert-dialog/alert-dialog.service";
import {MessageService} from "primeng/api";

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
        readonly finService: FinService,
        readonly dialog: MatDialog,
        readonly alertService: AlertDialogService,
        readonly messageService: MessageService
    ) {
    }

    async ngOnInit() {
        this.categories = await this.finService.getCategories();
        this.accounts = await this.finService.getAccounts();
        this.initAccountDatabase();
    }

    initAccountDatabase() {
        this.categories.forEach((category: FinCategory) => {
            const categoryAccounts: FinAccount[] = this.accounts
                .filter((account: FinAccount) => account.category_id === category.id)
                .sort((a: FinAccount, b: FinAccount) => a.id - b.id);
            this.database.set(category.id, new AccountTreeWrapper(new AccountDatabase(categoryAccounts)));
        });
    }

    hasNestedChild(_: number, nodeData: AccountNode): boolean {
        if (!nodeData || !nodeData.children) {
            return false;
        }
        return nodeData.children.length > 0;
    }

    async addAccount(parentAccount: FinAccount, categoryId: number) {
        const account: FinAccount = new FinAccount();
        account.category_id = categoryId;
        if (!isNullOrUndefined(parentAccount)) {
            account.parent_account = parentAccount.id;
            account.id = parentAccount.id;
        } else {
            account.parent_account = null;
        }
        const dialogRef = this.dialog.open(FinAccountAddComponent, {
            data: {
                existingAccounts: this.accounts.map((account: FinAccount) => account.id),
                new: true,
                initialData: account
            }
        });
        const dialogResult: FinAccount = await dialogRef.afterClosed().toPromise();
        if (dialogResult !== null) {
            this.accounts.push(dialogResult);
            this.initAccountDatabase();
        }
    }

    async editAccount(account: FinAccount) {
        const dialogRef = this.dialog.open(FinAccountAddComponent, {
            data: {
                existingAccounts: this.accounts.map((account: FinAccount) => account.id),
                new: false,
                initialData: account
            }
        });
        const dialogResult: FinAccount = await dialogRef.afterClosed().toPromise();
        if (dialogResult !== null) {
            const index: number = this.accounts.findIndex((account: FinAccount) => account.id === dialogResult.id);
            if(index != -1) {
                this.accounts[index] = dialogResult;
            }
            this.initAccountDatabase();
        }
    }

    async deleteAccount(accountId: number) {
        if (await this.alertService.confirm(`You are deleting the account ${accountId}.`)) {
            this.finService.deleteAccount(accountId);
            this.accounts = this.accounts.filter((account: FinAccount) => account.id !== accountId);
            this.initAccountDatabase();
        }

    }

    async addCategory() {
        const dialogRef = this.dialog.open(FinCategoryAddComponent,
            {
                data:
                    {
                        existingCategories: this.categories.map((category: FinCategory) => category.name),
                        new: true
                    }
            }
        );
        const dialogResult: FinCategory = await dialogRef.afterClosed().toPromise();
        if (dialogResult !== null) {
            this.categories.push(dialogResult);
            this.database.set(dialogResult.id, new AccountTreeWrapper(new AccountDatabase([])));
        }
    }

    async editCategory(category: FinCategory) {
        const dialogRef = this.dialog.open(FinCategoryAddComponent,
            {
                data:
                    {
                        existingCategories: this.categories.map((category: FinCategory) => category.name),
                        new: false,
                        oldData: category
                    }
            }
        );
        await dialogRef.afterClosed().toPromise();
    }

    async deleteCategory(categoryId: number) {
        if (await this.alertService.confirm('You are deleting a category, affecting all accounts in it.')) {
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                life: 3000,
                detail: 'Successfully deleted category #' + await this.finService.deleteCategory(categoryId)
            });
            this.categories = this.categories.filter((category: FinCategory) => category.id !== categoryId);
        }
    }

}

class AccountTreeWrapper {
    database: AccountDatabase;
    nestedTreeControl: NestedTreeControl<AccountNode> = new NestedTreeControl<AccountNode>(this._getChildren);
    nestedDataSource: MatTreeNestedDataSource<AccountNode> = new MatTreeNestedDataSource();

    constructor(database: AccountDatabase) {
        this.database = database;
        this.database.dataChange.subscribe(data => this.nestedDataSource.expensesData = data);
    }

    private _getChildren(node: AccountNode): AccountNode[] {
        return node.children;
    }
}
