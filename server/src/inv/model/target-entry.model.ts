import {CRUDModel} from '../../core/crud/crud.model';

export class TargetEntryModel implements CRUDModel {
    id: number = 0;
    stock_id: number = 0;
    name: string = '';
    amount: string = '';
}
