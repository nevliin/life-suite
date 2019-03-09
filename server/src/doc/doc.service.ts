import {DBExecuteResult, DBQueryResult, DbUtil} from '../core/db/db.util';
import {CRUDConstructor, DBType} from '../core/crud/crud-constructor';
import {CoreTypes} from '../core/core.types';
import {Singletons} from '../core/singletons';

export class DocService {

    db: DbUtil = Singletons.get(CoreTypes.PgSQLUtil);

    constructor() {
    }

}
