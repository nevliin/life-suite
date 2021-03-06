import {DBExecuteResult, DBQueryResult, DbUtil} from '../core/db/db.util';
import {CompareEntryModel} from './model/compare-entry.model';
import {ComparisonRequest, CreateMultipleEntriesRequest} from './model/inv.model';
import {CRUDConstructor, DBType} from '../core/crud/crud-constructor';
import {EntryModel} from './model/entry.model';
import {CoreTypes} from '../core/core.types';
import {DIContainer, Injectable} from '../core/di-container';
import {InvTypes} from './inv.types';

export class InvService implements Injectable {

    entryModelCRUD: CRUDConstructor<EntryModel> = DIContainer.get(InvTypes.EntryCRUD);
    db: DbUtil = DIContainer.get(CoreTypes.PgSQLUtil);

    constructor() {
    }

    async getComparison(reqParams: ComparisonRequest): Promise<CompareEntryModel[]> {
        const statement: string =
            `SELECT ite.name, (sq.entry_count - ite.amount) AS comparison
            FROM (
                   SELECT target_id, COUNT(*) AS entry_count
                   FROM inv_entry
                   WHERE valid = 1
                   AND stock_id = ${this.db.escNumber(Number(reqParams.stockId))}
                   GROUP BY inv_entry.target_id
                 ) sq
            JOIN inv_target_entry ite ON sq.target_id = ite.id
            WHERE valid = 1
            UNION
            SELECT inv_target_entry.name, 0 - amount AS comparison
            FROM inv_target_entry
            WHERE inv_target_entry.id NOT IN
                  (SELECT target_id FROM inv_entry WHERE valid = 1)
            AND stock_id = ${this.db.escNumber(Number(reqParams.stockId))} AND valid = 1;`;

        const result: DBQueryResult = await this.db.query(statement);

        return result.rows.map(row => {
            return new CompareEntryModel(row.name, row.comparison);
        });
    }

    async getAutoFill(name: string) {
        const statement: string = `SELECT id FROM inv_entry WHERE name LIKE '${this.db.esc(name)}';`;
        const result: DBQueryResult = await this.db.query(statement);

        if (result.rows.length > 0) {
            return result.rows[0].id;
        } else {
            return null;
        }
    }

    async getNextId(): Promise<number> {
        const statement: string = 'SELECT MAX(id) AS maxid FROM inv_entry;';
        const result: DBQueryResult = await this.db.query(statement);
        return Number.parseInt(result.rows[0].maxid) + 1;
    }

    async createMultipleEntries(reqParams: CreateMultipleEntriesRequest): Promise<number[]> {
        let statement: string =
            `INSERT INTO inv_entry(stock_id, target_id, name, producer, market, weight_in_g, kcal, expiration_date, price, note) VALUES `;
        const properties =
            ['stock_id', 'target_id', 'name', 'producer', 'market', 'weight_in_g', 'kcal', 'expiration_date', 'price', 'note'];

        const valuesString = this.entryModelCRUD.objectToSQLInsertString(properties, reqParams.entry);

        for (let i = 0; i < reqParams.amount; i++) {
            if (i !== 0) {
                statement += ', ';
            }
            statement += valuesString;
        }

        statement += ' RETURNING id';

        const result: DBExecuteResult = await this.db.execute(statement);

        return result.nativeResult.rows.map(row => row.id);
    }

    init(): Promise<void> {
        return undefined;
    }
}
