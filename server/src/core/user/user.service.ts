import {ServerConfig} from '../config/server-config.model';
import {DBQueryResult, DbUtil} from '../db/db.util';
import {Logger, LoggingUtil} from '../logging/logging.util';
import {RowDataPacket} from 'mysql';
import {ErrorCodeUtil} from '../../utils/error-code/error-code.util';
import {IUserDetailsModel} from './model/user-details.model';
import {MySqlUtil} from '../db/mysql.util';
import {DIContainer} from '../di-container';
import {CoreTypes} from '../core.types';

const config: ServerConfig = require('../../assets/server-config.json');

/**
 * Utility class for user authentication and route guarding
 */
export class UserService {

    db: DbUtil = DIContainer.get(CoreTypes.MySQLUtil);
    logger: Logger;

    /**
     * Init dependencies and route expensesData
     */
    async init() {
        this.logger = LoggingUtil.getLogger('user');
    }

    public async getUserDetails(userId: number): Promise<IUserDetailsModel> {
        const statement: string =
            `SELECT a.id, a.username, a.created_on, b.last_login, c.power
            FROM
            (SELECT id, username, created_on FROM auth_user WHERE id = ${this.db.escNumber(userId)}) AS a,
            (SELECT MAX(created_on) AS last_login FROM auth_token WHERE user_id = ${this.db.escNumber(userId)}) AS b,
            (SELECT MAX(power) AS power FROM auth_user
            JOIN auth_user_role ON auth_user.id = auth_user_role.user_id
            JOIN auth_role ON auth_user_role.role_id = auth_role.id
            WHERE auth_user.id = ${this.db.escNumber(userId)}) AS c;`;

        const result: DBQueryResult = await this.db.query(statement);

        if (result.rows.length === 1) {

            const statement2: string =
                `SELECT auth_role.id
                FROM auth_role
                JOIN auth_user_role ON auth_role.id = auth_user_role.role_id
                JOIN auth_user ON auth_user_role.user_id = auth_user.id
                WHERE auth_user.id = ${userId};`;
            const result2: DBQueryResult = await this.db.query(statement2);

            let roles: number[] = [];

            if (result2.rows.length > 0) {
                roles = result2.rows.map((row: RowDataPacket) => row.id);
            }

            return {
                id: result.rows[0]['id'],
                name: result.rows[0]['username'],
                createdOn: result.rows[0]['created_on'],
                lastLogin: result.rows[0]['last_login'],
                power: result.rows[0]['power'],
                roles: roles
            };
        } else {
            ErrorCodeUtil.findErrorCodeAndThrow('NO_SUCH_USER');
        }

    }
}
