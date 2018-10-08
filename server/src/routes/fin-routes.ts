import {NextFunction, Request, Response, Router} from "express";
import {AuthUtil} from "../utils/auth/auth.util";
import {ISignUpModel} from "../utils/auth/signup.model";
import {ErrorCodeUtil} from "../utils/error-code/error-code.util";
import {FinService} from "../services/fin/fin.service";
import {CategoryAddModel} from "../services/fin/category.model";

const express = require('express');

export const init = (): Router => {
    const finRouter = express.Router();
    const finService: FinService = new FinService();
    finRouter.post('/category/add', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categoryId: number = await finService.addCategory((<CategoryAddModel>req.body));
            res.status(200).send({
                categoryId: categoryId
            })
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });
    finRouter.post('/account/add', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: number = await AuthUtil.signUp((<ISignUpModel>req.body));
            res.status(200).send({
                userId: userId
            })
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    return finRouter;
};

export const finRouter = init();

