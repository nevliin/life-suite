import {DBQueryResult, DbUtil} from "../utils/db/db.util";
import {
    AccountBalanceRequest,
    AccountTransactionsRequest,
    AllTransactionsAmountRequest,
    CategoryTotalRequest
} from "./model/fin.model";
import {TransactionModel} from "./model/transaction.model";
import {ErrorCodeUtil} from "../utils/error-code/error-code.util";
import {isNullOrUndefined} from "../utils/util";
import {PgSqlUtil} from "../utils/db/pgsql.util";
import {AccountModel} from "./model/account.model";

export class FinService {

    db: DbUtil;

    constructor() {
        this.db = new PgSqlUtil();
    }

    async getAccountBalance(reqParams: AccountBalanceRequest): Promise<number | null> {
        if (!Number.isInteger(Number.parseInt(reqParams.accountId))) {
            ErrorCodeUtil.findErrorCodeAndThrow('INVALID_PARAMETER');
        }
        let year: number = Number.parseInt(reqParams.year);
        if (isNullOrUndefined(year) || Number.isNaN(year)) {
            year = (new Date()).getFullYear();
        } else if (year < 2000) {
            ErrorCodeUtil.findErrorCodeAndThrow('INVALID_PARAMETER');
        }

        let statement: string =
            `WITH RECURSIVE
                 accounts AS (
                   SELECT id
                   FROM fin_account
                   WHERE id = (SELECT account_id FROM constants)
                   UNION
                   SELECT e.id
                   FROM fin_account e
                          INNER JOIN accounts s ON s.id = e.parent_account
                 ),
                 constants (account_id, interval_year) AS (
                   VALUES (${this.db.escNumber(Number.parseInt(reqParams.accountId))},
                           date_trunc('year', to_timestamp('${this.db.escNumber(year)}-06-01 00:00:00.000', 'YYYY-MM-DD HH24:MI:SS.MS')))
                 )
            SELECT ((
                      SELECT COALESCE(SUM(amount), 0) as balance
                      FROM fin_transaction
                      WHERE fin_transaction.valid = 1
                        AND fin_transaction.created_on > ((SELECT interval_year FROM constants) + interval '3 hours')
                        AND fin_transaction.created_on < ((SELECT interval_year FROM constants) + interval '1 year' - interval '3 hours')
                        AND fin_transaction.account IN
                            (
                              SELECT *
                              FROM accounts
                            )
                    ) - (
                      SELECT COALESCE(SUM(amount), 0) as balance
                      FROM fin_transaction
                      WHERE fin_transaction.valid = 1
                        AND fin_transaction.created_on > ((SELECT interval_year FROM constants) + interval '3 hours')
                        AND fin_transaction.created_on < ((SELECT interval_year FROM constants) + interval '1 year' - interval '3 hours')
                        AND fin_transaction.contra_account IN (
                              SELECT *
                              FROM accounts
                            )
                    )) AS balance; `;

        const result: DBQueryResult = await this.db.query(statement);
        return (result.rows[0]) ? result.rows[0].balance : null;
    }

    async getAccountTransactions(reqParams: AccountTransactionsRequest): Promise<TransactionModel[]> {
        if (FinService.validAccountId(reqParams.accountId)) {
            let statement: string =
                `WITH RECURSIVE
                     accounts AS (
                       SELECT id
                       FROM fin_account
                       WHERE id = ${this.db.escNumber(Number.parseInt(reqParams.accountId))}
                       UNION
                       SELECT e.id
                       FROM fin_account e
                              INNER JOIN accounts s ON s.id = e.parent_account
                     )
                SELECT *
                FROM fin_transaction
                WHERE valid = 1
                  AND (account IN (SELECT id FROM accounts)
                         OR
                       contra_account IN (SELECT id FROM accounts))`;
            if(reqParams.from) {
                statement += ` AND fin_transaction.created_on > to_timestamp('${this.db.esc(reqParams.from)}', 'YYYY-MM-DD HH24:MI:SS.MS')`;
            }
            if(reqParams.to) {
                statement += ` AND fin_transaction.created_on < to_timestamp('${this.db.esc(reqParams.to)}', 'YYYY-MM-DD HH24:MI:SS.MS')`;
            }
            if(reqParams.limit && Number.isInteger(Number.parseInt(reqParams.limit))) {
                statement += ` LIMIT ${this.db.escNumber(Number.parseInt(reqParams.limit))}`;
            }
            statement += `;`;

            const result: DBQueryResult = await this.db.query(statement);
            return result.rows;
        } else {
            ErrorCodeUtil.findErrorCodeAndThrow('INVALID_PARAMETER');
        }
    }

    async getAllTransactionsAmount(reqParams: AllTransactionsAmountRequest) {
        let statement: string = `SELECT SUM(amount) AS amount FROM fin_transaction WHERE valid = 1 `;
        if (reqParams.from && reqParams.to) {
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
        if (Number.isNaN(reqParams.categoryId)) {
            ErrorCodeUtil.findErrorCodeAndThrow('INVALID_PARAMETER');
        }
        const categoryId: number = reqParams.categoryId;
        const from: Date = reqParams.from ? new Date(reqParams.from) : new Date();
        const to: Date = reqParams.to ? new Date(reqParams.to) : new Date();
        if (from.getTime() >= to.getTime()) {
            ErrorCodeUtil.findErrorCodeAndThrow('INVALID_PARAMETER');
        }

        let statement: string = `SELECT active FROM fin_category WHERE id = ${this.db.escNumber(categoryId)};`;
        const result: DBQueryResult = await this.db.query(statement);
        if (result.rows.length === 1 && !isNullOrUndefined(result.rows[0])) {
            const otherClauses: string = `AND valid = 1 AND created_on >= '${this.db.esc(from.toISOString().slice(0, 19).replace('T', ' '))}' AND created_on <= '${this.db.esc(to.toISOString().slice(0, 19).replace('T', ' '))}'`;
            const sum1: string = `SELECT sum(amount) FROM fin_transaction WHERE account IN (SELECT id FROM fin_account WHERE category_id = ${this.db.escNumber(categoryId)}) ${otherClauses}`;
            const sum2: string = `SELECT sum(amount) FROM fin_transaction WHERE contra_account IN (SELECT id FROM fin_account WHERE category_id = ${this.db.escNumber(categoryId)}) ${otherClauses}`;
            let statement2: string = `SELECT COALESCE((${result.rows[0].active ? sum1 : sum2}), 0) - COALESCE((${result.rows[0].active ? sum2 : sum1}), 0) AS amount`;
            const result2: DBQueryResult = await this.db.query(statement2);
            return result2.rows[0].amount;
        }
    }

    async getRecentlyUsedAccount(): Promise<AccountModel[]> {
        const statement =
            `WITH account_ids AS (
              (SELECT account, created_on
               FROM fin_transaction f_t1
               WHERE valid = 1
               ORDER BY created_on DESC)
              UNION
              (SELECT contra_account AS account, created_on
               FROM fin_transaction f_t1
               WHERE valid = 1
               ORDER BY created_on DESC)),
                 distinct_ids AS (
                   SELECT account, created_on
                   FROM account_ids
                   WHERE created_on =
                         (SELECT MAX(created_on)
                          FROM account_ids AS account_ids_2
                          WHERE account_ids_2.account = account_ids.account)
                   ORDER BY created_on DESC
                   LIMIT 20
                 )
            SELECT id, name, note, parent_account, category_id, valid, fin_account.created_on 
            FROM fin_account 
            JOIN distinct_ids ON fin_account.id = distinct_ids.account
            ORDER BY distinct_ids.created_on DESC
            LIMIT 20;`;
        const result: DBQueryResult = await this.db.query(statement);
        return result.rows as AccountModel[];
    }

    static validAccountId(accountId: string | number): boolean {
        if (isNullOrUndefined(accountId)) {
            return false;
        }
        return true;
    }

}