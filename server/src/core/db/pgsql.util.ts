import {IDBConfig, IServerConfig} from '../../assets/config/server-config.model';
import {DBExecuteResult, DBQueryResult, DbUtil} from './db.util';
import {Pool, QueryResult} from 'pg';
import {Logger, LoggingUtil} from '../logging/logging.util';

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
        this.setTimezone().then();
        this.testConnection().then();
    }

    async testConnection() {
        try {
            const client = await this.pool.connect();
            await client.query('SELECT NOW()');
            client.release();
        } catch (e) {
            this.logger.warn('Connection to PostgreSQL DB failed because ' + e.message, 'testConnection');
        }
    }

    async setTimezone() {
        this.pool.query('SET TIME ZONE \'UTC\';').then();
    }

    /**
     * Execute a query
     * @param query
     * @param values
     */
    async query(query: string, values?: any[]): Promise<DBQueryResult> {
        this.logger.debug(query, 'query');
        return new Promise<DBQueryResult>(((resolve, reject) => {
            this.pool.query(query, (err: Error, result: QueryResult) => {
                if (err) {
                    this.logger.error(err, 'query');
                    reject(err);
                } else {
                    resolve(this.queryResultToDBQueryResult(result));
                }
            });
        }));
    }

    queryResultToDBQueryResult(result: QueryResult): DBQueryResult {
        return {
            rows: result.rows,
            affectedRows: result.rows.length,
            changedRows: 0,
            insertId: null,
            nativeResult: result
        };
    }

    /**
     * Execute an insertion
     * @param query
     * @param values
     */
    async execute(query: string, values?: any[]): Promise<DBExecuteResult> {
        this.logger.debug(query, 'execute');
        return new Promise<DBExecuteResult>(((resolve, reject) => {
            this.pool.query(query, (err: Error, result: QueryResult) => {
                if (err) {
                    this.logger.error(err, 'execute');
                    reject(err);
                } else {
                    resolve(this.queryResultToDBExecuteResult(result));
                }
            });
        }));
    }

    queryResultToDBExecuteResult(result: QueryResult): DBExecuteResult {
        return {
            affectedRows: result.rowCount,
            changedRows: result.rowCount,
            insertId: (result.rows[0]) ? result.rows[0].id : null,
            nativeResult: result
        };
    }


}