import {ICRUDModel} from "../../core/crud/crud.model";

export class AccountModel implements ICRUDModel {
    id: number = null;
    name: string = null;
    note: string = null;
    parent_account: number = null;
    category_id: number = null;
    created_on: Date = null;
}