import {Application} from "express";
import {authRouter} from "./auth-routes";
import {CRUDConstructor} from "../core/crud-constructor";
import {CategoryModel} from "../models/fin/category.model";
import {AccountModel} from "../models/fin/account.model";
import {TransactionModel} from "../models/fin/transaction.model";
import {EntryModel} from "../models/inv/entry.model";
import {TargetEntryModel} from "../models/inv/target-entry.model";
import {invRouter} from "./inv-routes";

const express = require('express');
export const router = express.Router();

export class Routes {

    public static init(app: Application) {

        app.use('/auth', authRouter);
        app.use('/inv', invRouter);

        const categoryModelCRUD: CRUDConstructor<CategoryModel> = new CRUDConstructor(new CategoryModel(), 'fin_category', {softDelete: true});
        app.use('/fin/category', categoryModelCRUD.getRouter());

        const accountModelCRUD: CRUDConstructor<AccountModel> = new CRUDConstructor(new AccountModel(), 'fin_account', {
            softDelete: false,
            autoFilledFields: ['created_on', 'deactivated'],
            autoIncrementId: false
        });
        app.use('/fin/account', accountModelCRUD.getRouter());

        const transactionModelCRUD: CRUDConstructor<TransactionModel> = new CRUDConstructor(new TransactionModel(), 'fin_transaction', {
            softDelete: true,
            autoFilledFields: ['created_on'],
            autoIncrementId: true
        });
        app.use('/fin/transaction', transactionModelCRUD.getRouter());

    }
}
