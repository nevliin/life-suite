import {ICRUDModel} from "../../core/crud/crud.model";

export class TransactionModel implements ICRUDModel {
    id: number = null;
    account: number = null;
    contra_account: number = null;
    amount: number = null;
    note: string = null;
    planned_transaction_id: number = null;
    executed_on: Date = null;
}