import {ICRUDModel} from "../../core/crud/crud.model";

export class EntryModel implements ICRUDModel {
    id: number = 0;
    valid: boolean = false;
    name: string = '';
    producer: string = '';
    market: string = '';
    weight_in_g: number = 0;
    kcal: number = 0;
    expirationDate: Date = null;
    price: number = 0;
    note: number = 0;

}
