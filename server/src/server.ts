import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';
import * as http from 'http';
import {Routes} from './routes';
import {injectable} from 'inversify';
import {AuthService} from './core/auth/auth.service';
import {Singletons} from './core/singletons';
import {MySqlUtil} from './core/db/mysql.util';
import {CoreTypes} from './core/core.types';
import {PgSqlUtil} from './core/db/pgsql.util';
import {routeGuard} from './core/auth/route-guard';
import {ErrorCodeUtil} from './utils/error-code/error-code.util';
import errorHandler = require('errorhandler');
import methodOverride = require('method-override');

/**
 * The server.
 *
 * @class Server
 */
@injectable()
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
        Singletons.bind(MySqlUtil).to(CoreTypes.MySQLUtil);
        Singletons.bind(PgSqlUtil).to(CoreTypes.PgSQLUtil);
        Singletons.bind(AuthService).to(CoreTypes.AuthService);

        Singletons.bindStatic(ErrorCodeUtil);

        await Singletons.init();
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
