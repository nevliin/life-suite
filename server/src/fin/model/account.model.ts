import {ICRUDModel} from "../../core/crud/crud.model";

export class AccountModel implements ICRUDModel {
    id: number = 0;
    name: string = '';
    note: string = '';
    parent_account: number = 0;
    category_id: number = 0;
    created_on: Date = null;
}
