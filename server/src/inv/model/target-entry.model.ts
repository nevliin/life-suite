import {ICRUDModel} from '../../core/crud/crud.model';

export class TargetEntryModel implements ICRUDModel {
    id: number = 0;
    stock_id: number = 0;
    name: string = '';
    amount: string = '';
}
