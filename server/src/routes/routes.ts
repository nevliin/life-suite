import {Application} from "express";
import {authRouter} from "./auth-routes";
import {CRUDConstructor} from "../core/crud-constructor";
import {CategoryModel} from "../models/category.model";

const express = require('express');
export const router = express.Router();

export class Routes {

    public static init(app: Application) {

        app.use('/auth', authRouter);

        const categoryModelCRUD: CRUDConstructor<CategoryModel> = new CRUDConstructor(new CategoryModel(), 'fin_category', {softDelete: true})
        app.use('/fin/category', categoryModelCRUD.getRouter());
    }
}
