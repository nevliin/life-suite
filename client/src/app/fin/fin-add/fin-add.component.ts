import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FinAccount} from "../fin-account";
import {FinService} from "../fin.service";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {TwoWayMap} from "../../core/auth/two-way-map";

@Component({
    selector: 'app-fin-add',
    templateUrl: './fin-add.component.html',
    styleUrls: ['./fin-add.component.css']
})
export class FinAddComponent implements OnInit {

    accountsTwoWay: TwoWayMap<number, string>;
    accountIds: number[];
    accountNames: string[];


    filteredAccountOptions: Observable<number[]>;
    filteredAccountNameOptions: Observable<string[]>;
    filteredContraAccountOptions: Observable<number[]>;
    filteredContraAccountNameOptions: Observable<string[]>;

    transactionForm: FormGroup = this.fb.group({
        account: [null, Validators.compose([Validators.required, Validators.min(0), Validators.max(9999)])],
        accountName: [''],
        contraAccount: [null, Validators.compose([Validators.required, Validators.min(0), Validators.max(9999)])],
        contraAccountName: [''],
        amount: [0],
        note: ['']
    });

    constructor(
        readonly fb: FormBuilder,
        readonly finService: FinService
    ) {
    }

    async ngOnInit() {
        const tempMap: Map<number, string> = new Map();
        (await this.finService.getAccounts()).forEach((value: FinAccount) => tempMap.set(value.id, value.name));
        this.accountsTwoWay = new TwoWayMap(tempMap);
        this.accountIds = Array.from(this.accountsTwoWay.map.keys());
        this.accountNames = Array.from(this.accountsTwoWay.reverseMap.keys());

        this.filteredAccountOptions = this.transactionForm.get('account').valueChanges.pipe(
            startWith(''),
            map((value: number) => this._filterById(value))
        );
        this.filteredContraAccountOptions = this.transactionForm.get('contraAccount').valueChanges.pipe(
            startWith(''),
            map((value: number) => this._filterById(value))
        );
        this.filteredAccountNameOptions = this.transactionForm.get('accountName').valueChanges.pipe(
            startWith(''),
            map(value => this._filterByName(value))
        );
        this.filteredContraAccountNameOptions = this.transactionForm.get('contraAccountName').valueChanges.pipe(
            startWith(''),
            map(value => this._filterByName(value))
        );
    }

    reset() {

    }

    submit() {

    }

    private _filterById(value: number): number[] {
        let filterValue: string;
        if (value !== null) {
            filterValue = value.toString();
        } else {
            filterValue = '';
        }

        return this.accountIds.filter((accountId: number) => {
            return accountId.toString().includes(filterValue);
        })
    }

    private _filterByName(value: string): string[] {
        return this.accountNames.filter((accountName: string) => {
            return accountName.toLowerCase().includes(value.toLowerCase());
        })
    }

    updateAccountName($event: number) {
        this.transactionForm.get('accountName')
    }

    updateAccount($event: string) {

    }

}
