import {NextFunction, Request, Response, Router} from "express";
import {ErrorCodeUtil} from "../utils/error-code/error-code.util";
import {CRUDConstructor} from "../core/crud-constructor";
import {EntryModel} from "../models/inv/entry.model";
import {TargetEntryModel} from "../models/inv/target-entry.model";
import {InvService} from "../services/inv/inv.service";
import {CompareEntry} from "../services/inv/compare-entry";

const express = require('express');

export const init = (): Router => {
    const invRouter = express.Router();

    const invService: InvService = new InvService();

    // CRUD Routes
    const entryModelCRUD: CRUDConstructor<EntryModel> = new CRUDConstructor(new EntryModel(), 'inv_entry', {
        softDelete: true,
        autoIncrementId: true
    });

    const targetEntryModelCRUD: CRUDConstructor<TargetEntryModel> = new CRUDConstructor(new TargetEntryModel(), 'inv_target_entry', {
        softDelete: false,
        autoIncrementId: true
    });

    invRouter.use('/entry', entryModelCRUD.getRouter());

    invRouter.use('/targetEntry', targetEntryModelCRUD.getRouter());

    invRouter.get('/comparison', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result: CompareEntry[] = await invService.getComparison();
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

    return invRouter;
};

export const invRouter = init();