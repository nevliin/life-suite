import {ServerConfig} from '../config/server-config.model';
import {DBExecuteResult, DBQueryResult, DbUtil} from './db.util';
import {Pool, QueryResult} from 'pg';
import {Logger, LoggingUtil} from '../logging/logging.util';
import {injectable} from 'inversify';
import {Injectable} from '../di-container';

const config: ServerConfig = require('../../assets/server-config.json');

/**
 * Utility for interacting with a MySQL database
 */
@injectable()
export class PgSqlUtil extends DbUtil implements Injectable {

    private pool: Pool;
    private logger: Logger;


    async init(): Promise<void> {
    }

    /**
     * Create the db pool; uses database credentials from configs if none are provided
     * @param dbconfig
     */
    constructor() {
        super();
        this.logger = LoggingUtil.getLogger('PgSqlUtil');

        this.pool = new Pool({
            host: config.pgsqldb.host,
            user: config.pgsqldb.user,
            password: config.pgsqldb.password,
            database: config.pgsqldb.database,
            port: 5432
        });
        this.logger.info(`Successfully connected to PGSQL database ${config.pgsqldb.database}@${config.pgsqldb.host}`);
        this.setTimezone()
            .then()
            .catch(e => this.logger.warn(`Setting the timezone on the PGSQL connection failed because ${e.toString()}`));
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