import {IServerConfig} from "../assets/config/server-config.model";
import {DBExecuteResult, DBQueryResult, DbUtil} from "../utils/db/db.util";
import {ISignUpModel} from "./model/signup.model";
import {Logger, LoggingUtil} from "../utils/logging/logging.util";
import {OkPacket, RowDataPacket} from "mysql";
import {ErrorCodeUtil} from "../utils/error-code/error-code.util";
import {ILoginModel} from "./model/login.model";
import {IJWTPayloadModel} from "./model/jwt-payload.model";
import {IRoutePermission} from "../assets/route-permissions/route-permissions";
import {RouteWithPermissionsModel} from "./model/route-with-permissions.model";
import {NextFunction, Request, Response} from "express";
import {IUpdatePasswordModel} from "./model/update-password.model";
import {isNullOrUndefined} from "../utils/util";
import {IEditRolesModel} from "./model/edit-roles.model";
import {IUserDetailsModel} from "./model/user-details.model";
import {MySqlUtil} from "../utils/db/mysql.util";

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config: IServerConfig = require('../assets/config/server-config.json');
const routePermissions: IRoutePermission = require('../assets/route-permissions/route-permissions.json');

/**
 * Utility class for user authentication and route guarding
 */
export class AuthService {

    static db: DbUtil;
    static logger: Logger;
    static routePermissions: Map<string, RouteWithPermissionsModel> = new Map();

    /**
     * Init dependencies and route expensesData
     */
    static async init() {
        this.db = new MySqlUtil(config.auth);
        this.logger = LoggingUtil.getLogger('auth');
        await this.initRoutePermissions();
    }

    /**
     * Creates a user with the provided credentials, returns the user id
     * @param signUpModel
     */
    public static async signUp(signUpModel: ISignUpModel): Promise<number> {
        const hash: string = await bcrypt.hash(signUpModel.password, 10);

        try {
            const result: DBExecuteResult = await this.db.execute(`INSERT INTO auth_user(username, salted_hash) VALUES('${this.db.esc(signUpModel.username)}', '${hash}');`);
            return result.insertId;
        } catch (e) {
            ErrorCodeUtil.findErrorCodeAndThrow(e);
            this.logger.error(e, 'signUp');
        }
    }

    /**
     * Log in the user with the provided credentials, return a JWT token
     * @param loginModel
     */
    public static async login(loginModel: ILoginModel): Promise<string> {
        try {
        const result: DBQueryResult = await this.db.query(`SELECT id, salted_hash FROM auth_user WHERE username = '${loginModel.username}';`);
            if (result.rows[0] && result.rows[0].salted_hash && result.rows[0].id) {
                if (loginModel.password && bcrypt.compareSync(loginModel.password, result.rows[0].salted_hash)) {
                    const powerAndRoles: { power: number, roles: number[] } = await AuthService.getPowerAndRoles(result.rows[0].id);
                    const token: string = jwt.sign({
                            userId: result.rows[0].id,
                            power: powerAndRoles.power,
                            roles: powerAndRoles.roles
                        },
                        config.jwtsecret,
                        {
                            expiresIn: '30d'
                        }
                    );
                    await this.db.execute(`INSERT INTO auth_token(user_id, token) VALUES(${result.rows[0].id}, '${token}');`);
                    return token;
                } else {
                    ErrorCodeUtil.findErrorCodeAndThrow('INVALID_CREDENTIALS');
                }
            } else {
                ErrorCodeUtil.findErrorCodeAndThrow('INVALID_CREDENTIALS');
            }
        } catch (e) {
            throw e;
        }
    }

    public static async logOut(token: string) {
        if (!isNullOrUndefined(token)) {
            await this.invalidateToken(token);
        }
    }

    public static async updatePassword(updatePasswordModel: IUpdatePasswordModel): Promise<number> {
        const result: DBQueryResult = await this.db.query(`SELECT id, salted_hash FROM auth_user WHERE username = '${updatePasswordModel.username}';`);
        if (result.rows[0] && result.rows[0].salted_hash && result.rows[0].id) {
            if (updatePasswordModel.oldPassword && bcrypt.compareSync(updatePasswordModel.oldPassword, result.rows[0].salted_hash)) {
                const hash: string = await bcrypt.hash(updatePasswordModel.newPassword, 10);
                await this.db.execute(`UPDATE auth_user SET salted_hash='${hash}' WHERE id = ${result.rows[0].id};`);
                await this.invalidateTokens(result.rows[0].id);
                return result.rows[0].id;
            } else {
                ErrorCodeUtil.findErrorCodeAndThrow('INVALID_CREDENTIALS');
            }
        } else {
            ErrorCodeUtil.findErrorCodeAndThrow('NO_SUCH_USER');
        }
    }

    public static async verifyLogin(token: string): Promise<boolean> {
        if (!isNullOrUndefined(token)) {
            let statement: string = `SELECT valid FROM auth_token WHERE token='${token}';`;
            const result: DBQueryResult = await this.db.query(statement);
            if (result.rows.length === 0) {
                return false;
            } else if (result.rows[0].valid === 1) {
                return true;
            }
            return false;
        }
        return false;
    }

    public static async editRoles(editRolesModel: IEditRolesModel): Promise<boolean> {
        if (!isNullOrUndefined(editRolesModel.userId)) {
            if (editRolesModel.addRoles.length > 0) {
                for (const role of editRolesModel.addRoles) {
                    let statement: string = `INSERT INTO auth_user_role(user_id, role_id) VALUES(${editRolesModel.userId}, ${role});`;
                    await this.db.execute(statement);
                }
            }
            if (editRolesModel.removeRoles.length > 0) {
                for (const role of editRolesModel.addRoles) {
                    let statement: string = `DELETE FROM auth_user_role(user_id, role_id) WHERE user_id=${editRolesModel.userId} AND role_id=${role};`;
                    await this.db.execute(statement);
                }
            }
            return true;
        }
        return false;
    }

    public static async getUserDetails(userId: number): Promise<IUserDetailsModel> {
        const statement: string = `SELECT a.id, a.username, a.created_on, b.last_login, c.power 
            FROM 
            (SELECT id, username, created_on FROM auth_user WHERE id = ${this.db.escNumber(userId)}) AS a, 
            (SELECT MAX(created_on) AS last_login FROM auth_token WHERE user_id = ${this.db.escNumber(userId)}) AS b,
            (SELECT MAX(power) AS power FROM auth_user JOIN auth_user_role ON auth_user.id = auth_user_role.user_id JOIN auth_role ON auth_user_role.role_id = auth_role.id WHERE auth_user.id = ${this.db.escNumber(userId)}) AS c;`;
        const result: DBQueryResult = await this.db.query(statement);
        if (result.rows.length === 1) {
            const statement2: string = `SELECT auth_role.id 
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
            }
        } else {
            ErrorCodeUtil.findErrorCodeAndThrow('NO_SUCH_USER');
        }

    }

    /**
     * Router middleware that verifies the validity of the JWT token in the header auth-token and checks if the user
     * has access to the route; responds with an error if the token is invalid or the user has no access to this route
     * @param req
     * @param res
     * @param next
     */
    static routeGuard = async function (req: Request, res: Response, next: NextFunction) {
        try {
            if (req.cookies.auth_token) {
                const userId: number = await AuthService.verifyToken(req.cookies.auth_token);
                const route: RouteWithPermissionsModel = AuthService.isRouteGuarded(req.path);
                if (await AuthService.verifyRoutePermission(route, userId)) {
                    next();
                } else {
                    ErrorCodeUtil.resolveErrorOnRoute(ErrorCodeUtil.findErrorCode('ACC_DENIED'), res);
                }
            } else {
                const route: RouteWithPermissionsModel = AuthService.isRouteGuarded(req.path);
                if (await AuthService.verifyRoutePermission(route, null)) {
                    next();
                } else {
                    ErrorCodeUtil.resolveErrorOnRoute(ErrorCodeUtil.findErrorCode('ACC_DENIED'), res);
                }
            }
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(ErrorCodeUtil.findErrorCode('ACC_DENIED'), res);
        }
    };

    public static async getPowerAndRoles(userId: number): Promise<{ power: number, roles: number[] }> {
        let power: number = 0;
        let roles: number[] = [0];
        if (userId) {
            const result: DBQueryResult = await this.db.query(
                `SELECT auth_user_role.role_id as id, auth_role.power as power
                    FROM auth_user_role 
                    JOIN auth_user ON auth_user.id = auth_user_role.user_id
                    JOIN auth_role ON auth_role.id = auth_user_role.role_id
                    WHERE auth_user.id = ${userId};`);
            result.rows.forEach(row => {
                if (row.power > power) {
                    power = row.power;
                }
            });
            roles = roles.concat(result.rows.map(row => row.id));
        }
        return {power: power, roles: roles};
    }

    /**
     * Verifies the validity of a JWT token and returns the user id stored in it
     * @param token
     */
    public static async verifyToken(token: string): Promise<number> {
        try {
            const payload: IJWTPayloadModel = await jwt.verify(token, config.jwtsecret);

            let statement: string = `SELECT valid FROM auth_token WHERE token='${token}';`;
            const result: DBQueryResult = await this.db.query(statement);
            if (result.rows.length === 0) {
                return undefined;
            } else if (result.rows[0].valid === 0) {
                return undefined;
            }
            return payload.userId;
        } catch (e) {
            this.logger.debug(e, 'verifyToken');
            throw e;
        }
    }

    public static async invalidateTokens(userId: number) {
        let statement: string = `UPDATE auth_token SET valid=0 WHERE user_id=${userId};`;
        await this.db.execute(statement);
    }

    public static async invalidateToken(token: string) {
        let statement: string = `UPDATE auth_token SET valid=0 WHERE token='${this.db.esc(token)}';`;
        await this.db.execute(statement);
    }

    /**
     * Find the route relevant for the provided route and return it; undefined if no route in the chain is guarded
     * @param routeName
     */
    public static isRouteGuarded(routeName: string): RouteWithPermissionsModel {
        let route: RouteWithPermissionsModel;
        if (this.routePermissions.has(routeName)) {
            route = this.routePermissions.get(routeName);
        } else {
            const splitName: string[] = routeName.split('/');
            splitName.splice(0, 1);
            for (let i = 0; i < (splitName.length + 1); i++) {
                splitName.splice(splitName.length - 1, 1);
                if (this.routePermissions.has('/' + splitName.join('/'))) {
                    route = this.routePermissions.get('/' + splitName.join('/'));
                    break;
                }
            }
        }
        return route;
    }

    /**
     * Verify that the given user has access to the given route
     * @param route
     * @param userId
     */
    public static async verifyRoutePermission(route: RouteWithPermissionsModel, userId: number): Promise<boolean> {
        if (!route) {
            return true;
        }
        try {
            const result: { power: number, roles: number[] } = await AuthService.getPowerAndRoles(userId);
            const power: number = result.power;
            const roles: number[] = result.roles;
            if (route.requiredPower <= power) {
                return true;
            } else if (roles.some(role => route.permittedRoles.includes(role))) {
                return true;
            }
            return false;
        } catch (e) {
            if (ErrorCodeUtil.isErrorWithCode(e)) {
                throw e;
            }
            this.logger.error(e, 'verifyPermissions');
        }
    }

    /**
     * Initialize the routePermissions map
     */
    public static async initRoutePermissions() {
        let rows: any[] = [];
        try {
            rows = (await this.db.query('SELECT name, id FROM auth_role;')).rows;
        } catch (e) {
            this.logger.error(e, 'initRoutePermissions');
        }

        const roleIds: Map<string, number> = new Map();
        rows.forEach(row => {
            if (row.name && !isNullOrUndefined(row.id)) {
                roleIds.set(row.name, row.id);
            }
        });

        if (routePermissions) {
            const power: number = (routePermissions.requiredPower) ? routePermissions.requiredPower : 0;
            this.generateRoute(routePermissions, power, '', roleIds);
        } else {
            this.logger.warn('No route permission model provided; all routes are exposed.');
        }
    }

    /**
     * Recursive method for generating all guarded routes from the JSON configuration
     * @param route
     * @param parentPower
     * @param parentRoute
     * @param roleIds
     */
    public static generateRoute(route: IRoutePermission, parentPower: number, parentRoute: string, roleIds: Map<string, number>) {
        const power: number = (route.requiredPower > parentPower) ? route.requiredPower : parentPower;
        const absoluteRoute: string = (parentRoute === '/' ? '' : parentRoute) + '/' + route.route;
        this.routePermissions.set(
            absoluteRoute,
            new RouteWithPermissionsModel(power, (route.permittedRoles) ? route.permittedRoles
                .filter(name => roleIds.has(name))
                .map(name => roleIds.get(name)) : []
            )
        );
        if (!!route.children) {
            route.children.forEach(child => this.generateRoute(child, power, absoluteRoute, roleIds));
        }
    }
}
