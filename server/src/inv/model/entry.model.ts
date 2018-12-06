import {ICRUDModel} from "../../core/crud/crud.model";

export class EntryModel implements ICRUDModel {
    id: number = null;
    valid: boolean = null;
    name: string = null;
    producer: string = null;
    market: string = null;
    weight: number = null;
    kcal: number = null;
    expirationDate: Date = null;
    price: number = null;
    note: number = null;
}