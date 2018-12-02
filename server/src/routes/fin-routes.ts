import {NextFunction, Request, Response, Router} from "express";
import {FinService} from "../services/fin/fin.service";
import {CRUDConstructor} from "../core/crud/crud-constructor";
import {CategoryModel} from "../models/fin/category.model";
import {AccountModel} from "../models/fin/account.model";
import {TransactionModel} from "../models/fin/transaction.model";
import {ConstraintModel} from "../models/fin/constraint.model";
import {ErrorCodeUtil} from "../utils/error-code/error-code.util";
import {
    AccountTransactionsRequest,
    AllTransactionsAmountRequest,
    CategoryTotalRequest
} from "../services/fin/fin.model";

const express = require('express');

export const init = (): Router => {
    const finRouter = express.Router();

    const finService: FinService = new FinService();

    finRouter.post('/getAccountTransactions', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result: TransactionModel[] = await finService.getAccountTransactions(<AccountTransactionsRequest>req.body);
            res.status(200).send({
                data: result
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    finRouter.post('/getCategoryTotal', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const amount: number = await finService.getCategoryTotal(<CategoryTotalRequest>req.body);
            res.status(200).send({
                data: {
                    amount
                }
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    finRouter.post('/getAllTransactionsAmount', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const amount: number = await finService.getAllTransactionsAmount(<AllTransactionsAmountRequest>req.body);
            res.status(200).send({
                data: {
                    amount
                }
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    const categoryModelCRUD: CRUDConstructor<CategoryModel> = new CRUDConstructor(new CategoryModel(), 'fin_category', {
        softDelete: true
    });
    finRouter.use('/category', categoryModelCRUD.getRouter());

    const accountModelCRUD: CRUDConstructor<AccountModel> = new CRUDConstructor(new AccountModel(), 'fin_account', {
        softDelete: true,
        autoFilledFields: ['created_on'],
        autoIncrementId: false
    });
    finRouter.use('/account', accountModelCRUD.getRouter());

    const transactionModelCRUD: CRUDConstructor<TransactionModel> = new CRUDConstructor(new TransactionModel(), 'fin_transaction', {
        softDelete: true,
        autoFilledFields: ['executed_on'],
        autoIncrementId: true
    });
    finRouter.use('/transaction', transactionModelCRUD.getRouter());

    const constraintModelCRUD: CRUDConstructor<ConstraintModel> = new CRUDConstructor(new ConstraintModel(), 'fin_constraint', {
        softDelete: true,
        autoFilledFields: ['created_on'],
        autoIncrementId: true
    });
    finRouter.use('/constraint', constraintModelCRUD.getRouter());

    return finRouter;
};

export const finRouter = init();