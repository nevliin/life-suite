import {Application} from "express";
import {authRouter} from "./auth-routes";
import {invRouter} from "./inv-routes";
import {finRouter} from "./fin-routes";

const express = require('express');

export const router = express.Router();

export class Routes {

    public static init(app: Application) {

        app.use('/auth', authRouter);
        app.use('/inv', invRouter);
        app.use('/fin', finRouter)

    }
}
