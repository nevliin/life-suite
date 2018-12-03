import {DBQueryResult, DbUtil} from "../../utils/db/db.util";
import {AccountTransactionsRequest, AllTransactionsAmountRequest, CategoryTotalRequest} from "./fin.model";
import {TransactionModel} from "../../models/fin/transaction.model";
import {ErrorCodeUtil} from "../../utils/error-code/error-code.util";
import {isNullOrUndefined} from "../../utils/util";
import {PgSqlUtil} from "../../utils/db/pgsql.util";

export class FinService {

    db: DbUtil;

    constructor() {
        this.db = new PgSqlUtil();
    }

    async getAccountTransactions(reqParams: AccountTransactionsRequest): Promise<TransactionModel[]> {
        let statement: string =
            `SELECT (id, account, contra_account, amount, note, created_on, planned_transaction_id, executed_on) 
            FROM fin_transaction WHERE account = ${this.db.escNumber(reqParams.accountId)} OR contra_account = ${this.db.escNumber(reqParams.accountId)};`

        return [];
    }

    async getAllTransactionsAmount(reqParams: AllTransactionsAmountRequest) {
        let statement: string = `SELECT SUM(amount) AS amount FROM fin_transaction WHERE valid = 1 `;
        if(reqParams.from && reqParams.to) {
            statement += `AND created_on > '${this.db.esc(reqParams.from)}' AND created_on < '${this.db.esc(reqParams.to)}'`;
        } else if (reqParams.from) {
            statement += `AND created_on > '${this.db.esc(reqParams.from)}'`;
        } else if (reqParams.to) {
            statement += `AND created_on < '${this.db.esc(reqParams.to)}'`;
        }
        statement += ';';
        const result: DBQueryResult = await this.db.query(statement);
        return result.rows[0].amount;

    }

    async getCategoryTotal(reqParams: CategoryTotalRequest): Promise<number> {
        if(Number.isNaN(reqParams.categoryId)) {
            ErrorCodeUtil.findErrorCodeAndThrow('INVALID_PARAMETER');
        }
        const categoryId: number = reqParams.categoryId;
        const from: Date = reqParams.from ? new Date(reqParams.from) : new Date();
        const to: Date = reqParams.to ?  new Date(reqParams.to) : new Date();
        if(from.getTime() >= to.getTime()) {
            ErrorCodeUtil.findErrorCodeAndThrow('INVALID_PARAMETER');
        }

        let statement: string = `SELECT active FROM fin_category WHERE id = ${this.db.escNumber(categoryId)};`;
        const result: DBQueryResult = await this.db.query(statement);
        if(result.rows.length === 1 && !isNullOrUndefined(result.rows[0])) {
            const otherClauses: string = `AND valid = 1 AND created_on >= '${this.db.esc(from.toISOString().slice(0, 19).replace('T', ' '))}' AND created_on <= '${this.db.esc(to.toISOString().slice(0, 19).replace('T', ' '))}'`;
            const sum1: string = `SELECT sum(amount) FROM fin_transaction WHERE account IN (SELECT id FROM fin_account WHERE category_id = ${this.db.escNumber(categoryId)}) ${otherClauses}`;
            const sum2: string = `SELECT sum(amount) FROM fin_transaction WHERE contra_account IN (SELECT id FROM fin_account WHERE category_id = ${this.db.escNumber(categoryId)}) ${otherClauses}`;
            let statement2: string = `SELECT COALESCE((${result.rows[0].active ? sum1 : sum2}), 0) - COALESCE((${result.rows[0].active ? sum2 : sum1}), 0) AS amount`;
            const result2: DBQueryResult = await this.db.query(statement2);
            return result2.rows[0].amount;
        }

    }
}