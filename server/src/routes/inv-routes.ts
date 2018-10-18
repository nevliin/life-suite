import {NextFunction, Request, Response, Router} from "express";
import {AuthUtil} from "../utils/auth/auth.util";
import {IUpdatePasswordModel} from "../utils/auth/update-password.model";
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

    // CRUD Routes
    const entryModelCRUD: CRUDConstructor<EntryModel> = new CRUDConstructor(new EntryModel(), 'inv_entry', {
        softDelete: true,
        autoIncrementId: true
    });
    invRouter.use('/entry', entryModelCRUD.getRouter());

    const targetEntryModelCRUD: CRUDConstructor<TargetEntryModel> = new CRUDConstructor(new TargetEntryModel(), 'inv_target_entry', {
        softDelete: false,
        autoIncrementId: true
    });
    invRouter.use('/targetEntry', targetEntryModelCRUD.getRouter());

    return invRouter;
};

export const invRouter = init();