import {ICRUDModel} from '../../core/crud/crud.model';

export class EntryModel implements ICRUDModel {
    id: number = 0;
    stock_id: number = 0;
    target_id: number = 0;
    name: string = '';
    producer: string = '';
    market: string = '';
    weight_in_g: number = 0;
    kcal: number = 0;
    expiration_date: Date = null;
    price: number = 0;
    note: number = 0;
    created_on: Date = new Date();
}
