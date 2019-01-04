import * as mysql from "mysql";
import {OkPacket, Pool} from "mysql";
import {QueryError, RowDataPacket} from 'mysql';
import {IDBConfig, IServerConfig} from "../../assets/config/server-config.model";

export interface DBResultBase {
    affectedRows: number;
    changedRows: number;
    insertId: number;
}

export interface DBQueryResult extends DBResultBase {
    rows: any[];
}

export interface DBExecuteResult extends DBResultBase {
}

/**
 * Utility for interacting with a SQL database
 */
export abstract class DbUtil {
    /**
     * Create the db pool; uses database credentials from configs if none are provided
     * @param dbconfig
     */
    constructor(dbconfig?: IDBConfig) {};

    /**
     * Execute a query
     * @param query
     * @param values
     */
    abstract query(query: string, values?: any[]): Promise<DBQueryResult>;

    /**
     * Execute an insertion
     * @param query
     * @param values
     */
    abstract execute(query: string, values?: any[]): Promise<DBExecuteResult>;

    /**
     * Escape a string to make it safe for the usage in a SQL query
     * @param str
     */
    esc(str: string): string {
        return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
            switch (char) {
                case "\0":
                    return "\\0";
                case "\x08":
                    return "\\b";
                case "\x09":
                    return "\\t";
                case "\x1a":
                    return "\\z";
                case "\n":
                    return "\\n";
                case "\r":
                    return "\\r";
                case "\"":
                case "'":
                case "\\":
                case "%":
                    return "\\" + char; // prepends a backslash to backslash, percent,
                                        // and double/single quotes
            }
        });
    }

    escNumber(num: number | null): number | null {
        if(num === null) {
            return null;
        }
        if(Number.isNaN(Number.parseFloat(num.toString()))) {
            throw new Error('Not a number!');
        }
        return num;
    }
}