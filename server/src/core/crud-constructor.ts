import {IDBConfig} from "../assets/config/server-config.model";
import {DbUtil} from "../utils/db/db.util";
import {ICRUDModel} from "./crud.model";
import {Logger, LoggingUtil} from "../utils/logging/logging.util";
import {ErrorCodeUtil} from "../utils/error-code/error-code.util";
import {NextFunction, Router, Response, Request} from "express";
import {OkPacket, RowDataPacket} from "mysql";
import {isNullOrUndefined} from "../utils/util";

const express = require('express');

/**
 * Constructs all CRUD operations for objects (modelled as classes implementing ICRUDModel) and saved in a MySQL table.
 * Special properties are 'id' and 'valid' - 'id' identifies the object and must be a property of all provided models,
 * 'valid' is used to soft-delete objects and is optional (The fields don't need to have this name in the MySQL table
 * - you can change it in the optional 'fieldMappings').
 */
export class CRUDConstructor<T extends ICRUDModel, > {

    private db: DbUtil;
    private logger: Logger;

    /**
     * Model object
     */
    private model: T;
    /**
     * Mapping of object properties to DB field
     */
    private fieldMappings: Map<string, DBField>;
    /**
     * Name of the DB table containing the objects
     */
    readonly dbTable: string;
    /**
     * 'id' field in DB table is auto incremented
     */
    readonly autoIncrementId: boolean;
    /**
     * Objects should be soft deleted by setting the property 'valid'
     */
    readonly softDelete: boolean;
    /**
     * Fields to be omitted from create() as they are auto-filled by the DB
     */
    readonly autoFilledFields: string[] = [];
    /**
     * Optional remapping of the valid field
     */
    readonly validFieldMapping: string = 'valid';

    constructor(model: T, dbTable: string, options?: CRUDOptions) {
        this.logger = LoggingUtil.getLogger('CRUDConstructor');
        this.model = model;
        this.dbTable = dbTable;
        if(options) {
            // Initialize some properties with the possibly provided values
            this.autoIncrementId = (!isNullOrUndefined(options.autoIncrementId)) ? options.autoIncrementId : true;
            this.softDelete = options.softDelete;
            this.db = new DbUtil(options.dbconfig);
            this.fieldMappings = this.completeFieldMappings(model, options.fieldMappings);
            this.autoFilledFields = (options.autoFilledFields) ? options.autoFilledFields : [];
            this.validFieldMapping = (options.validFieldMapping) ? options.validFieldMapping : 'valid';
        } else {
            // Initialize some necessary fields with no value from options
            this.db = new DbUtil();
            this.fieldMappings = this.completeFieldMappings(model);
        }
    }

    /**
     * Complete the optional field mappings with the model object's properties
     * @param model - Model object
     * @param inputMap - Optionally provided field mappings
     */
    private completeFieldMappings(model: T, inputMap?: Map<string, string>): Map<string, DBField> {
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

    /**
     * Create object
     * @param data - Object to be written to the DB table
     * @returns object ID
     */
    public async create(data: T): Promise<number> {
        let properties: string[] = Array.from(this.fieldMappings.keys());
        if(this.autoFilledFields.length > 0) {
            // If there are auto filled fields, remove them from the inserted fields
            properties = properties.filter(property => {
                return !this.autoFilledFields.includes(property);
            });
        }
        if (this.autoIncrementId) {
            // If the ID is auto-incremented, remove the ID field
            properties = properties.filter(property => {
                return property != 'id';
            });
        }
        // Get the DB field mappings
        const fields: string = properties.map(property => this.fieldMappings.get(property).name).join(', ');
        let statement: string = `INSERT INTO ${this.dbTable}(${fields}) VALUES (`;

        // Add the value of each property to the statement
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
     * Read object
     * @param id - ID of the object
     * @returns Object with properties read from the DB table
     */
    public async read(id: number): Promise<T> {
        // Get fields to be read and add create the statement with them
        const properties: string[] = Array.from(this.fieldMappings.keys());
        const fieldsArray: string[] = properties.map(property => this.fieldMappings.get(property).name);
        const fields: string = fieldsArray.join(', ');
        let statement: string = `SELECT ${fields} FROM ${this.dbTable} WHERE ${this.fieldMappings.get('id').name} = ${id}`;

        // Add check for validity if the objects are soft-deleted
        if(this.softDelete) {
            statement += ` AND ${this.fieldMappings.get('valid').name} = 1`;
        }

        statement += ';';

        const rows: RowDataPacket[] = await this.db.query(statement);

        if(rows[0]) {
            // Assign fields of the result to an empty object and return it
            const result: any = {};
            properties.forEach((property, index) => {
                if(this.fieldMappings.get(property).type === DBFieldType.BOOLEAN) {

                }
                result[property] = rows[0][fieldsArray[index]];
            });
            // @ts-ignore
            return <T>result;
        } else {
            ErrorCodeUtil.findErrorCodeAndThrow('NO_SUCH_OBJECT');
        }
    }

    /**
     * Update object
     * @param data - Object to be written to the DB table
     * @returns Object ID
     */
    public async update(data: T): Promise<number> {
        let properties: string[] = Array.from(this.fieldMappings.keys());
        if (this.autoIncrementId) {
            properties = properties.filter(property => {
                return property != 'id'
            });
        }
        const fields: string = properties.map(property => this.fieldMappings.get(property).name).join(', ');
        let statement: string = `UPDATE ${this.dbTable} SET `;

        properties.forEach((property, index) => {
            if (index != 0) {
                statement += ', ' + this.fieldMappings.get(property).name + ' = ';
            } else {
                statement += this.fieldMappings.get(property).name + ' = ';
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
        statement += ` WHERE ${this.fieldMappings.get('id').name} = ${data.id};`;

        const result: OkPacket = await this.db.execute(statement);
        if(result.affectedRows != 1) {
            ErrorCodeUtil.findErrorCodeAndThrow('UPDATED_FAILED');
        }
        return data.id;
    }

    /**
     * Delete object
     * @param id - ID of the object
     * @returns ID of the deleted object
     */
    public async delete(id: number): Promise<number> {
        let statement: string = '';
        if(this.softDelete) {
            statement = `UPDATE ${this.dbTable} SET ${this.fieldMappings.get('valid').name} = 0 WHERE ${this.fieldMappings.get('id').name} = ${id};`;
        } else {
            statement = `DELETE FROM ${this.dbTable} WHERE ${this.fieldMappings.get('id').name} = ${id};`;
        }
        await this.db.execute(statement);
        return id;
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
        router.get('/read/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const data: T = await this.read(req.params.id);
                res.status(200).send({
                    data: data
                });
            } catch (e) {
                ErrorCodeUtil.resolveErrorOnRoute(e, res);
            }
        });
        router.put('/update', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const id: number = await this.update(req.body);
                res.status(200).send({
                    id: id
                });
            } catch (e) {
                ErrorCodeUtil.resolveErrorOnRoute(e, res);
            }
        });
        router.delete('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const id: number = await this.delete(req.params.id);
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
    type: DBFieldType;

    constructor(name?: string, type?: DBFieldType) {
        this.name = name;
        this.type = type;
    }
}

/**
 * Available DB field types
 */
enum DBFieldType {
    STRING = 'STRING',
    BOOLEAN = 'BOOLEAN',
    NUMBER = 'NUMBER',
    TIMESTAMP = 'TIMESTAMP'
}

/**
 * Options for customizing the behaviour of the class
 */
interface CRUDOptions {
    autoIncrementId?: boolean;
    softDelete?: boolean;
    autoFilledFields?: string[];
    dbconfig?: IDBConfig;
    fieldMappings?: Map<string, string>;
    validFieldMapping: string;
}