import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");
import {Routes} from "./routes";
import {LoggingUtil} from "./utils/logging/logging.util";
import {DbUtil} from "./utils/db/db.util";
import {Singletons} from "./core/singletons";
import {MySqlUtil} from "./utils/db/mysql.util";
import {PgSqlUtil} from "./utils/db/pgsql.util";
import {AuthService} from "./auth/auth.service";


/**
 * The server.
 *
 * @class Server
 */
export class Server {

    public app: express.Application;

    private loggingUtil: LoggingUtil;
    private mySqlConnection: DbUtil;
    private pgSqlConnection: DbUtil;

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    public static bootstrap(): Server {
        Singletons.init();
        return new Server();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        //create expressjs application
        this.app = express();

        //set up singletons
        this.singletons();

        //configure application
        this.config();

        //add routing
        this.routes();
    }

    public singletons()  {
        this.loggingUtil = new LoggingUtil();
        this.mySqlConnection = new MySqlUtil();
        this.mySqlConnection = new PgSqlUtil();
    }

    /**
     * Configure application
     *
     * @class Server
     * @method config
     */
    public async config() {
        //add static paths
        this.app.use(express.static(path.join(__dirname, "public")));

        //use logger middlware
        this.app.use(logger("dev"));

        //use json form parser middlware
        this.app.use(bodyParser.json());

        //use query string parser middlware
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));

        //use cookie parser middleware
        this.app.use(cookieParser("SECRET_GOES_HERE"));

        //use override middlware
        this.app.use(methodOverride());

        //catch 404 and forward to error handler
        this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            err.status = 404;
            next(err);
        });

        //error handling
        this.app.use(errorHandler());

        this.app.use(AuthService.routeGuard);
    }

    /**
     * Create router
     *
     * @class Server
     * @method api
     */
    public routes() {
        Routes.init(this.app);
    }
}