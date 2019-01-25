import {NextFunction, Request, Response, Router} from 'express';
import {ErrorCodeUtil} from '../utils/error-code/error-code.util';
import {CRUDConstructor, DBType} from '../core/crud/crud-constructor';
import {EntryModel} from './model/entry.model';
import {TargetEntryModel} from './model/target-entry.model';
import {InvService} from './inv.service';
import {CompareEntryModel} from './model/compare-entry.model';
import {StockModel} from './model/stock.model';

const express = require('express');

export const init = (): Router => {
    const invRouter = express.Router();

    const invService: InvService = new InvService();

    // CRUD Routes
    const entryModelCRUD: CRUDConstructor<EntryModel> = new CRUDConstructor(new EntryModel(), 'inv_entry', {
        softDelete: true,
        autoIncrementId: true,
        dbType: DBType.PGSQL
    });

    const targetEntryModelCRUD: CRUDConstructor<TargetEntryModel> = new CRUDConstructor(new TargetEntryModel(), 'inv_target_entry', {
        softDelete: true,
        autoIncrementId: true,
        dbType: DBType.PGSQL
    });

    const stockModelCRUD: CRUDConstructor<StockModel> = new CRUDConstructor(new StockModel(), 'inv_stock', {
        softDelete: true,
        autoIncrementId: true,
        dbType: DBType.PGSQL
    });

    invRouter.use('/entry', entryModelCRUD.getRouter());

    invRouter.use('/targetEntry', targetEntryModelCRUD.getRouter());

    invRouter.use('/stock', stockModelCRUD.getRouter());

    invRouter.get('/comparison', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result: CompareEntryModel[] = await invService.getComparison(req.query);
            res.status(200).send({
                comparison: result
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    invRouter.post('/autoFill', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result: number = await invService.getAutoFill(req.body.name);
            if (result !== null) {
                res.status(200).send({
                    data: await entryModelCRUD.readAll(result)
                });
            } else {
                res.status(200).send({
                    data: null
                });
            }
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    invRouter.get('/nextId', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result: number = await invService.getNextId();
            res.status(200).send({
                nextId: result
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    invRouter.post('/createMultipleEntries', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result: number[] = await invService.createMultipleEntries(req.body);

            res.status(200).send({
                data: result
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    return invRouter;
};

export const invRouter = init();
