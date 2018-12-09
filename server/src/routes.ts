import {Application} from "express";
import {authRouter} from "./auth/auth.routing";
import {invRouter} from "./inv/inv.routing";
import {finRouter} from "./fin/fin.routing";

const express = require('express');

export const router = express.Router();

export class Routes {

    public static init(app: Application) {

        app.use('/auth', authRouter);
        app.use('/inv', invRouter);
        app.use('/fin', finRouter)

    }
}