import 'reflect-metadata';
import {PgSqlUtil} from './core/db/pgsql.util';
import {Container} from 'inversify';
import {MySqlUtil} from './core/db/mysql.util';
import {CoreTypes} from './core/core.types';

const container = new Container();

container.bind<PgSqlUtil>(CoreTypes.PgSQLUtil).to(PgSqlUtil);
container.bind<MySqlUtil>(CoreTypes.MySQLUtil).to(MySqlUtil);

export { container };
