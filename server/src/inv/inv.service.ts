import {DBQueryResult, DbUtil} from "../utils/db/db.util";
import {CompareEntryModel} from "./model/compare-entry.model";
import {PgSqlUtil} from "../utils/db/pgsql.util";

export class InvService {

    db: DbUtil;

    constructor() {
        this.db = new PgSqlUtil();
    }

    async getComparison(): Promise<CompareEntryModel[]> {
        let statement: string = `SELECT ite.name, (sq.entry_count - ite.amount) AS comparison
            FROM (
                   SELECT target_id, COUNT(*) AS entry_count
                   FROM inv_entry
                   WHERE valid = 1
                   GROUP BY inv_entry.target_id
                 ) sq
            JOIN inv_target_entry ite on sq.target_id = ite.id
            UNION
            SELECT inv_target_entry.name, 0 - amount AS comparison
            FROM inv_target_entry
            WHERE inv_target_entry.id NOT IN
                  (SELECT target_id FROM inv_entry WHERE valid = 1);`;

        const result: DBQueryResult = await this.db.query(statement);

        return result.rows.map(row => {
            return new CompareEntryModel(row.name, row.comparison);
        });
    }

    async getAutoFill(name: string) {
        let statement: string = `SELECT id FROM inv_entry WHERE name LIKE '${this.db.esc(name)}';`;
        const result: DBQueryResult = await this.db.query(statement);

        if(result.rows.length > 0) {
            return result.rows[0].id;
        } else {
            return null;
        }
    }

    async getNextId(): Promise<number> {
        let statement: string = 'SELECT MAX(id) AS maxid FROM inv_entry;';
        const result: DBQueryResult = await this.db.query(statement);
        return Number.parseInt(result.rows[0].maxid)+1;
    }
}
