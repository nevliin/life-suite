import {IDBConfig} from "../assets/config/server-config.model";
import {DbUtil} from "../utils/db/db.util";
import {ICRUDModel} from "./crud.model";
import {Logger, LoggingUtil} from "../utils/logging/logging.util";
import {ErrorCodeUtil} from "../utils/error-code/error-code.util";
import {NextFunction, Router, Response, Request} from "express";
import {OkPacket} from "mysql";
import {isNullOrUndefined} from "../utils/util";

const express = require('express');

export class CRUDConstructor<T extends ICRUDModel> {

    private db: DbUtil;
    private logger: Logger;

    /**
     * Model object
     */
    private model: T;
    /**
     * Mapping of object properties to db field
     */
    private fieldMappings: Map<string, DBField>;
    readonly dbTable: string;
    readonly autoIncrementId: boolean;

    constructor(model: T, dbTable: string, autoIncrementId?: boolean, dbconfig?: IDBConfig, fieldMappings?: Map<string, string>) {
        this.db = new DbUtil(dbconfig);
        this.logger = LoggingUtil.getLogger('CRUDConstructor');
        this.model = model;
        this.fieldMappings = this.completeFieldMappings(fieldMappings, model);
        this.dbTable = dbTable;
        this.autoIncrementId = (!isNullOrUndefined(autoIncrementId)) ? autoIncrementId : true;
    }

    private completeFieldMappings(inputMap: Map<string, string>, model: any): Map<string, DBField> {
        const result: Map<string, DBField> = new Map();
        if (!inputMap) {
            inputMap = new Map();
        }
        Object.keys(model).forEach(key => {
            const dbField: DBField = new DBField();
            dbField.name = (inputMap.has(key)) ? inputMap.get(key) : key;
            if (typeof model[key] === ('undefined' || 'function')) {
                this.logger.warn(`Illegal model '${model.constructor.name}' provided; property '${key}' is undefined or a function.`, 'completeFieldMappings');
            } else {
                if (typeof model[key] === 'number') {
                    dbField.type = DBFieldType.NUMBER;
                } else if (typeof model[key] === 'boolean') {
                    dbField.type = DBFieldType.BOOLEAN;
                } else if (model[key] instanceof Date) {
                    dbField.type = DBFieldType.TIMESTAMP;
                } else {
                    dbField.type = DBFieldType.STRING;
                }
                result.set(key, dbField);
            }
        });
        return result;
    }

    public async create(data: any): Promise<number> {
        let properties: string[] = Array.from(this.fieldMappings.keys());
        if (this.autoIncrementId) {
            properties = properties.filter(property => {
                return property != 'id'
            });
        }
        const fields: string = properties.map(property => this.fieldMappings.get(property).name).join(', ');
        let statement: string = `INSERT INTO ${this.dbTable}(${fields}) VALUES (`;

        properties.forEach((property, index) => {
            if (index != 0) {
                statement += ', ';
            }
            if (this.fieldMappings.get(property).type === (DBFieldType.STRING || DBFieldType.TIMESTAMP)) {
                statement += `'${this.db.esc(data[property].toString())}'`;
            } else if (this.fieldMappings.get(property).type === DBFieldType.BOOLEAN) {
                if (typeof data[property] === 'boolean') {
                    const value: number = data[property] ? 1 : 0;
                    statement += `${value}`;
                } else {
                    this.logger.debug(`Invalid value '${data[property]}' provided for type boolean.`, 'create');
                    ErrorCodeUtil.findErrorCodeAndThrow('INVALID_DATA');
                }
            } else {
                statement += `${Number(data[property])}`;
            }
        });
        statement += ');';

        const result: OkPacket = await this.db.execute(statement);
        return result.insertId;
    }

    /**
     * Get router with paths for all CRUD operations
     */
    public getRouter(): Router {
        const router: Router = express.Router();
        router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const id: number = await this.create(req.body);
                res.status(200).send({
                    id: id
                });
            } catch (e) {
                ErrorCodeUtil.resolveErrorOnRoute(e, res);
            }
        });
        return router;
    }

}

/**
 * Internal representation of a DB column; type defaults to string if none is matched
 */
class DBField {
    name: string;
    type: DBFieldType
}

enum DBFieldType {
    STRING = 'STRING',
    BOOLEAN = 'BOOLEAN',
    NUMBER = 'NUMBER',
    TIMESTAMP = 'TIMESTAMP'
}