import {IDBConfig, IServerConfig} from "../../assets/config/server-config.model";
import {DBExecuteResult, DBQueryResult, DbUtil} from './db.util';
import {Pool, QueryResult} from "pg";
import {Logger, LoggingUtil} from "../logging/logging.util";

const config: IServerConfig = require('../../assets/config/server-config.json');

/**
 * Utility for interacting with a MySQL database
 */
export class PgSqlUtil extends DbUtil {

    private pool: Pool;
    private logger: Logger;

    /**
     * Create the db pool; uses database credentials from configs if none are provided
     * @param dbconfig
     */
    constructor(dbconfig?: IDBConfig) {
        super();
        this.logger = LoggingUtil.getLogger('PgSqlUtil');
        if (dbconfig) {
            this.pool = new Pool({
                host: dbconfig.host,
                user: dbconfig.user,
                password: dbconfig.password,
                database: dbconfig.database,
                port: 5432
            });
        } else {
            this.pool = new Pool({
                host: config.pgsqldb.host,
                user: config.pgsqldb.user,
                password: config.pgsqldb.password,
                database: config.pgsqldb.database,
                port: 5432
            });
        }
    }

    /**
     * Execute a query
     * @param query
     * @param values
     */
    async query(query: string, values?: any[]): Promise<DBQueryResult> {
        return new Promise<DBQueryResult>(((resolve, reject) => {
            this.pool.query(query, (err: Error, result: QueryResult) => {
                if (err) {
                    this.logger.error(err, 'query');
                    reject(err);
                }
                resolve(this.queryResultToDBQueryResult(result));
            });
        }));
    }

    queryResultToDBQueryResult(result: QueryResult): DBQueryResult {
        return {
            rows: result.rows,
            affectedRows: result.rows.length,
            changedRows: 0,
            insertId: null
        }
    }

    /**
     * Execute an insertion
     * @param query
     * @param values
     */
    async execute(query: string, values?: any[]): Promise<DBExecuteResult> {
        return new Promise<DBExecuteResult>(((resolve, reject) => {
            this.pool.query(query, (err: Error, result: QueryResult) => {
                if (err) {
                    this.logger.error(err, 'execute');
                    reject(err);
                }
                resolve(this.queryResultToDBExecuteResult(result));
            });
        }));
    }

    queryResultToDBExecuteResult(result: QueryResult): DBExecuteResult {
        return {
            affectedRows: result.rows.length,
            changedRows: result.rows.length,
            insertId: result.rows[0].id
        }
    }


}