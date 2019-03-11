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
import {DIContainer} from '../core/di-container';
import {FinTypes} from './fin.types';

const express = require('express');

export const finRouter = (): Router => {
    const finRouter = express.Router();

    const finService: FinService = DIContainer.get(FinTypes.FinService);

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

    finRouter.use('/category', DIContainer.get(FinTypes.CategoryCRUD).getRouter());

    finRouter.use('/account', DIContainer.get(FinTypes.AccountCRUD).getRouter());

    finRouter.use('/transaction', DIContainer.get(FinTypes.TransactionCRUD).getRouter());

    finRouter.use('/template', DIContainer.get(FinTypes.TemplateCRUD).getRouter());

    finRouter.use('/constraint', DIContainer.get(FinTypes.ConstraintCRUD).getRouter());

    return finRouter;
};
