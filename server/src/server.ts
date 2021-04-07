import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';
import * as http from 'http';
import {Routes} from './routes';
import {AuthService} from './core/auth/auth.service';
import {DIContainer} from './core/di-container';
import {MySqlUtil} from './core/db/mysql.util';
import {CoreTypes} from './core/core.types';
import {PgSqlUtil} from './core/db/pgsql.util';
import {routeGuard} from './core/auth/route-guard';
import {ErrorCodeUtil} from './utils/error-code/error-code.util';
import errorHandler = require('errorhandler');
import methodOverride = require('method-override');
import {CRUDConstructor, DBType} from './core/crud/crud-constructor';
import {UserModel} from './core/user/model/user.model';
import {ServerConfig} from './core/config/server-config.model';
import {RoleModel} from './core/auth/model/role.model';
import {UserService} from './core/user/user.service';
import {TagModel} from './doc/model/tag.model';
import {DocTypes} from './doc/doc.types';
import {DocService} from './doc/doc.service';
import {CategoryModel} from './fin/model/category.model';
import {AccountModel} from './fin/model/account.model';
import {TransactionModel} from './fin/model/transaction.model';
import {TemplateModel} from './fin/model/template.model';
import {ConstraintModel} from './fin/model/constraint.model';
import {FinTypes} from './fin/fin.types';
import {FinService} from './fin/fin.service';
import {EntryModel} from './inv/model/entry.model';
import {TargetEntryModel} from './inv/model/target-entry.model';
import {StockModel} from './inv/model/stock.model';
import {InvService} from './inv/inv.service';
import {InvTypes} from './inv/inv.types';

const config: ServerConfig = require('./assets/server-config.json');

/**
 * The server.
 *
 * @class Server
 */
export class Server {

    public app: express.Application;
    public server: http.Server;
    public httpPort: string;

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    public static async bootstrap() {
        await this.initSingletons();
        new Server();
    }

    public static async initSingletons() {
        DIContainer.bind(MySqlUtil).to(CoreTypes.MySQLUtil);
        DIContainer.bind(PgSqlUtil).to(CoreTypes.PgSQLUtil);

        await DIContainer.init();

        DIContainer.bind(AuthService).to(CoreTypes.AuthService);
        DIContainer.bind(UserService).to(CoreTypes.UserService);
        DIContainer.bind(DocService).to(DocTypes.DocService);
        DIContainer.bind(FinService).to(FinTypes.FinService);
        DIContainer.bind(InvService).to(InvTypes.InvService);

        DIContainer.bindInstance(new CRUDConstructor<UserModel>(new UserModel(), 'auth_user', 'user', {
            autoIncrementId: true,
            autoFilledFields: [
                'created_on'
            ],
            dbConfig: config.auth
        })).to(CoreTypes.UserCRUD);
        DIContainer.bindInstance(new CRUDConstructor<RoleModel>(new RoleModel(), 'auth_role', 'role', {
            autoIncrementId: true,
            autoFilledFields: [
                'created_on'
            ]
        })).to(CoreTypes.RoleCRUD);


        DIContainer.bindInstance(new CRUDConstructor(new TagModel(), 'doc_tag', 'tag', {
            autoIncrementId: true,
            dbType: DBType.PGSQL,
            autoFilledFields: [
                'created_on'
            ]
        })).to(DocTypes.TagCRUD);
        DIContainer.bindInstance(new CRUDConstructor(new TagModel(), 'doc_document', 'document', {
            autoIncrementId: true,
            dbType: DBType.PGSQL,
            autoFilledFields: [
                'created_on'
            ]
        })).to(DocTypes.DocumentCRUD);
        DIContainer.bindInstance(new CRUDConstructor(new TagModel(), 'doc_folder', 'folder', {
            autoIncrementId: true,
            dbType: DBType.PGSQL,
            autoFilledFields: [
                'created_on'
            ]
        })).to(DocTypes.FolderCRUD);


        DIContainer.bindInstance(new CRUDConstructor(new CategoryModel(), 'fin_category', 'category', {
            softDelete: true,
            dbType: DBType.PGSQL
        })).to(FinTypes.CategoryCRUD);
        DIContainer.bindInstance(new CRUDConstructor(new AccountModel(), 'fin_account', 'account', {
            softDelete: true,
            autoFilledFields: ['created_on'],
            autoIncrementId: false,
            dbType: DBType.PGSQL
        })).to(FinTypes.AccountCRUD);
        DIContainer.bindInstance(new CRUDConstructor(new TransactionModel(), 'fin_transaction', 'transaction', {
            softDelete: true,
            autoFilledFields: ['executed_on'],
            autoIncrementId: true,
            dbType: DBType.PGSQL
        })).to(FinTypes.TransactionCRUD);
        DIContainer.bindInstance(new CRUDConstructor(new TemplateModel(), 'fin_template', 'template', {
            autoFilledFields: ['created_on'],
            autoIncrementId: true,
            dbType: DBType.PGSQL
        })).to(FinTypes.TemplateCRUD);
        DIContainer.bindInstance(new CRUDConstructor(new ConstraintModel(), 'fin_constraint', 'constraint', {
            softDelete: true,
            autoFilledFields: ['created_on'],
            autoIncrementId: true,
            dbType: DBType.PGSQL
        })).to(FinTypes.ConstraintCRUD);


        DIContainer.bindInstance(new CRUDConstructor(new EntryModel(), 'inv_entry', 'entry', {
            softDelete: true,
            autoIncrementId: true,
            dbType: DBType.PGSQL
        })).to(InvTypes.EntryCRUD);
        DIContainer.bindInstance(new CRUDConstructor(new TargetEntryModel(), 'inv_target_entry', 'targetEntry', {
            softDelete: true,
            autoIncrementId: true,
            dbType: DBType.PGSQL
        })).to(InvTypes.TargetEntryCRUD);
        DIContainer.bindInstance(new CRUDConstructor(new StockModel(), 'inv_stock', 'stock', {
            autoIncrementId: true,
            dbType: DBType.PGSQL
        })).to(InvTypes.StockCRUD);

        DIContainer.bindStatic(ErrorCodeUtil);

        await DIContainer.init();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        this.app = express();
        this.httpPort = this.normalizePort(process.env.PORT || 65432);

        this.config(this.app);
        this.routes(this.app);

        this.server = this.app.listen(this.httpPort);
        console.log('Now listening on port ' + this.httpPort);
        // add error handler
        this.server.on('error', this.onError);
    }

    /**
     * Configure application
     *
     * @class Server
     * @method config
     */
    public config(app) {
        // add static paths
        app.use(express.static(path.join(__dirname, 'public')));

        // use logger middlware
        app.use(logger('dev'));

        // use json form parser middlware
        app.use(bodyParser.json());

        // use query string parser middlware
        app.use(bodyParser.urlencoded({
            extended: true
        }));

        // use cookie parser middleware
        app.use(cookieParser('SECRET_GOES_HERE'));

        // use override middlware
        app.use(methodOverride());

        // catch 404 and forward to error handler
        app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            err.status = 404;
            next(err);
        });

        // error handling
        app.use(errorHandler());

        app.use(routeGuard);
    }

    /**
     * Create router
     *
     * @class Server
     * @method api
     */
    public routes(app) {
        Routes.init(app);
    }

    public normalizePort(val) {
        const port = parseInt(val, 10);

        if (isNaN(port)) {
            // named pipe
            return val;
        }

        if (port >= 0) {
            // port number
            return port;
        }

        return false;
    }

    /**
     * Event listener for HTTP server "error" event.
     */
    private onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        const bind = typeof this.httpPort === 'string'
            ? 'Pipe ' + this.httpPort
            : 'Port ' + this.httpPort;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

}
