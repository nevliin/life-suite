import * as mysql from 'mysql';
import {OkPacket, Pool, QueryError, RowDataPacket} from 'mysql';
import {ServerConfig} from '../config/server-config.model';
import {DBExecuteResult, DBQueryResult, DbUtil} from './db.util';
import {Logger, LoggingUtil} from '../logging/logging.util';
import {injectable} from 'inversify';
import {Injectable} from '../di-container';

const config: ServerConfig = require('../../assets/server-config.json');

/**
 * Utility for interacting with a MySQL database
 */
@injectable()
export class MySqlUtil extends DbUtil implements Injectable {

    private pool: Pool;
    private logger: Logger;


    async init(): Promise<void> {
        this.logger = LoggingUtil.getLogger('MySqlUtil');

        this.pool = mysql.createPool({
            host: config.mysqldb.host,
            user: config.mysqldb.user,
            password: config.mysqldb.password,
            database: config.mysqldb.database,
            port: 3306
        });
        this.logger.info(`Successfully connected to MySQL database ${config.mysqldb.database}@${config.mysqldb.host}`);
    }

    /**
     * Create the db pool; uses database credentials from configs if none are provided
     * @param dbconfig
     */
    constructor() {
        super();
    }

    /**
     * Execute a query
     * @param query
     */
    async query(query: string): Promise<DBQueryResult> {
        this.logger.debug(query, 'query');
        return new Promise<DBQueryResult>(((resolve, reject) => {
            this.pool.query(query, (err: QueryError, rows: RowDataPacket[]) => {
                if (err) {
                    this.logger.error(err, 'query');
                    reject(err);
                } else {
                    resolve(this.rowDataPacketToDBQueryResult(rows));
                }
            });
        }));
    }

    rowDataPacketToDBQueryResult(rows: RowDataPacket[]): DBQueryResult {
        return {
            affectedRows: rows.length,
            changedRows: 0,
            insertId: null,
            rows: rows,
            nativeResult: rows
        };
    }

    /**
     * Execute an insertion
     * @param query
     */
    async execute(query: string): Promise<DBExecuteResult> {
        this.logger.debug(query, 'execute');
        return new Promise<DBExecuteResult>(((resolve, reject) => {
            this.pool.query(query, (err: QueryError, result: OkPacket) => {
                if (err) {
                    this.logger.error(err, 'execute');
                    reject(err);
                } else {
                    resolve(this.okPacketToDBExecuteResult(result));
                }
            });
        }));
    }

    okPacketToDBExecuteResult(result: OkPacket): DBExecuteResult {
        return {
            insertId: result.insertId,
            changedRows: result.changedRows,
            affectedRows: result.affectedRows,
            nativeResult: result
        };
    }

}
