import {Application} from "express";
import {authRouter} from "./auth-routes";
import {CRUDConstructor} from "../core/crud-constructor";
import {CategoryModel} from "../models/category.model";
import {AccountModel} from "../models/account.model";
import {TransactionModel} from "../models/transaction.model";

const express = require('express');
export const router = express.Router();

export class Routes {

    public static init(app: Application) {

        app.use('/auth', authRouter);

        const categoryModelCRUD: CRUDConstructor<CategoryModel> = new CRUDConstructor(new CategoryModel(), 'fin_category', {softDelete: true});
        app.use('/fin/category', categoryModelCRUD.getRouter());

        const accountModelCRUD: CRUDConstructor<AccountModel> = new CRUDConstructor(new AccountModel(), 'fin_account', {softDelete: true});
        app.use('/fin/account', accountModelCRUD.getRouter());

        const transactionModelCRUD: CRUDConstructor<TransactionModel> = new CRUDConstructor(new TransactionModel(), 'fin_transaction', {softDelete: true});
        app.use('/fin/transaction', transactionModelCRUD.getRouter());
    }
}
