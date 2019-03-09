import {CRUDModel} from '../../core/crud/crud.model';

export class TransactionModel implements CRUDModel {
    id: number = 0;
    account: number = 0;
    contra_account: number = 0;
    amount: number = 0;
    note: string = '';
    created_on: Date = null;
    planned_transaction_id: number = 0;
    executed_on: Date = null;
}
