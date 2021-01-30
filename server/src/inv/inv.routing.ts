import {NextFunction, Request, Response, Router} from 'express';
import {ErrorCodeUtil} from '../utils/error-code/error-code.util';
import {InvService} from './inv.service';
import {CompareEntryModel} from './model/compare-entry.model';
import {DIContainer} from '../core/di-container';
import {InvTypes} from './inv.types';

const express = require('express');

export const invRouter = (): Router => {
    const invRouter = express.Router();

    const invService: InvService = DIContainer.get(InvTypes.InvService);

    invRouter.use('/entry', DIContainer.get(InvTypes.EntryCRUD).getRouter());
    invRouter.use('/targetEntry', DIContainer.get(InvTypes.TargetEntryCRUD).getRouter());
    invRouter.use('/stock', DIContainer.get(InvTypes.StockCRUD).getRouter());

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
                    data: await DIContainer.get(InvTypes.EntryCRUD).readAll(result)
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
