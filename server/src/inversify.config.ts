import 'reflect-metadata';
import {PgSqlUtil} from './core/db/pgsql.util';
import {Container} from 'inversify';
import {MySqlUtil} from './core/db/mysql.util';
import {CoreTypes} from './core/core.types';
import {AuthController} from './core/auth/auth.routing';
import {AuthService} from './core/auth/auth.service';
import {Server} from './server';

const container = new Container();

container.bind<PgSqlUtil>(CoreTypes.PgSQLUtil).to(PgSqlUtil);
container.bind<MySqlUtil>(CoreTypes.MySQLUtil).to(MySqlUtil);

container.bind<AuthController>(CoreTypes.AuthController).to(AuthController);
container.bind<AuthService>(CoreTypes.AuthService).to(AuthService);

export { container };
