import {ICRUDModel} from "../../core/crud.model";

export class AccountModel implements ICRUDModel {
    id: number = null;
    name: string = null;
    note: string = null;
    parent_account: number = null;
    category_id: number = null;
    deactivated: boolean = false;
    created_on: Date = null;
}