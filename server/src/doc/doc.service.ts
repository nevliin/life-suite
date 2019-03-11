import {DbUtil} from '../core/db/db.util';
import {CoreTypes} from '../core/core.types';
import {DIContainer, Injectable} from '../core/di-container';

export class DocService implements Injectable {

    db: DbUtil = DIContainer.get(CoreTypes.PgSQLUtil);

    constructor() {
    }

    init(): Promise<void> {
        return undefined;
    }

}
