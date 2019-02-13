import {ICRUDModel} from '../../core/crud/crud.model';

export class TemplateModel implements ICRUDModel {
    id: number = 0;
    name: string = '';
    account: number = 0;
    contra_account: number = 0;
    amount: number = 0;
    note: string = '';
    created_on: Date = new Date();
}
