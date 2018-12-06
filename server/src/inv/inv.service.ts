import {DBQueryResult, DbUtil} from "../utils/db/db.util";
import {CompareEntryModel} from "./model/compare-entry.model";
import {MySqlUtil} from "../utils/db/mysql.util";

export class InvService {

    db: DbUtil;

    constructor() {
        this.db = new MySqlUtil();
    }

    async getComparison(): Promise<CompareEntryModel[]> {
        let statement: string = `SELECT inv_entry.name,(COUNT(*)-amount) AS 'comparison' 
            FROM inv_entry JOIN inv_target_entry USING(name) 
            WHERE valid = 1 
            GROUP BY name 
            UNION 
            SELECT inv_target_entry.name, 0-amount AS 'comparison' 
            FROM inv_target_entry 
            WHERE inv_target_entry.name NOT IN 
                (SELECT name FROM inv_entry WHERE valid = 1);`;

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
