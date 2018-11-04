export class FinTransaction {
    id: number;
    account: number;
    contra_account: number;
    amount: number;
    note: string;
    created_on: Date;
    planned_transaction_id: number;
    executed_on: Date;
}
