import {NextFunction, Request, Response, Router} from 'express';
import {FinService} from './fin.service';
import {CRUDConstructor, DBType} from '../core/crud/crud-constructor';
import {CategoryModel} from './model/category.model';
import {AccountModel} from './model/account.model';
import {TransactionModel} from './model/transaction.model';
import {ConstraintModel} from './model/constraint.model';
import {ErrorCodeUtil} from '../utils/error-code/error-code.util';
import {
    AccountBalanceByCategoryRequest,
    AccountBalanceRequest,
    AccountBalanceResponse,
    AccountTransactionsRequest,
    AllTransactionsAmountRequest,
    CategoryTotalRequest,
    YearlyCloseRequest
} from './model/fin.model';
import {TemplateModel} from './model/template.model';

const express = require('express');

export const init = (): Router => {
    const finRouter = express.Router();

    const finService: FinService = new FinService();

    finRouter.get('/transactionsByAccount', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result: TransactionModel[] = await finService.getAccountTransactions(<AccountTransactionsRequest>req.query);
            res.status(200).send({
                data: result
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    finRouter.post('/yearlyClose', async (req: Request, res: Response, next: NextFunction) => {
        try {
            await finService.doYearlyClose(<YearlyCloseRequest>req.body);
            res.status(200).send({
                data: {
                    success: true
                }
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    finRouter.get('/unfinishedYears', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const unfinishedYears: number[] = await finService.yearlyClosesDone();
            res.status(200).send({
                data: {
                    unfinishedYears: unfinishedYears
                }
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

    finRouter.get('/accountBalance', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const amount: number = await finService.getAccountBalance(<AccountBalanceRequest>req.query);
            res.status(200).send({
                data: {
                    amount
                }
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    finRouter.get('/accountBalancesByCategory', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const balances: AccountBalanceResponse[] =
                await finService.getAccountBalancesByCategory(<AccountBalanceByCategoryRequest>req.query);
            res.status(200).send({
                data: {
                    balances
                }
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    finRouter.get('/recentlyUsedAccounts', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: AccountModel[] = await finService.getRecentlyUsedAccount();
            res.status(200).send({
                data
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    const categoryModelCRUD: CRUDConstructor<CategoryModel> = new CRUDConstructor(new CategoryModel(), 'fin_category', 'category', {
        softDelete: true,
        dbType: DBType.PGSQL
    });
    finRouter.use('/category', categoryModelCRUD.getRouter());

    const accountModelCRUD: CRUDConstructor<AccountModel> = new CRUDConstructor(new AccountModel(), 'fin_account', 'account', {
        softDelete: true,
        autoFilledFields: ['created_on'],
        autoIncrementId: false,
        dbType: DBType.PGSQL
    });
    finRouter.use('/account', accountModelCRUD.getRouter());

    const transactionModelCRUD: CRUDConstructor<TransactionModel> = new CRUDConstructor(new TransactionModel(), 'fin_transaction', 'transaction', {
        softDelete: true,
        autoFilledFields: ['executed_on'],
        autoIncrementId: true,
        dbType: DBType.PGSQL
    });
    finRouter.use('/transaction', transactionModelCRUD.getRouter());

    const templateModelCRUD: CRUDConstructor<TemplateModel> = new CRUDConstructor(new TemplateModel(), 'fin_template', 'template', {
        autoFilledFields: ['created_on'],
        autoIncrementId: true,
        dbType: DBType.PGSQL
    });
    finRouter.use('/template', templateModelCRUD.getRouter());

    const constraintModelCRUD: CRUDConstructor<ConstraintModel> = new CRUDConstructor(new ConstraintModel(), 'fin_constraint', 'constraint', {
        softDelete: true,
        autoFilledFields: ['created_on'],
        autoIncrementId: true,
        dbType: DBType.PGSQL
    });
    finRouter.use('/constraint', constraintModelCRUD.getRouter());

    return finRouter;
};

export const finRouter = init();
