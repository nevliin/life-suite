import {DbUtil} from "../../utils/db/db.util";
import {CompareEntry} from "./compare-entry";
import {RowDataPacket} from "mysql";

export class InvService {

    db: DbUtil;

    constructor() {
        this.db = new DbUtil();
    }

    async getComparison(): Promise<CompareEntry[]> {
        let statement: string = `SELECT inv_entry.name,(COUNT(*)-amount) AS 'comparison' 
            FROM inv_entry JOIN inv_target_entry USING(name) 
            WHERE valid = 1 
            GROUP BY name 
            UNION 
            SELECT inv_target_entry.name, 0-amount AS 'comparison' 
            FROM inv_target_entry 
            WHERE inv_target_entry.name NOT IN 
                (SELECT name FROM inv_entry WHERE valid = 1);`;

        const rows: RowDataPacket[] = await this.db.query(statement);

        return rows.map(row => {
            return new CompareEntry(row.name, row.comparison);
        });
    }

    async getAutoFill(name: string) {
        let statement: string = `SELECT id FROM inv_entry WHERE name LIKE '${this.db.esc(name)}';`;
        const rows: RowDataPacket[] = await this.db.query(statement);

        if(rows.length > 0) {
            return rows[0].id;
        } else {
            return null;
        }
    }

    async getNextId(): Promise<number> {
        let statement: string = 'SELECT MAX(id) AS maxid FROM inv_entry;';
        const rows: RowDataPacket[] = await this.db.query(statement);
        return Number.parseInt(rows[0]['maxid'])+1;

    }
}
