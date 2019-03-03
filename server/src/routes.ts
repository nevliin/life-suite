import {Application} from 'express';
import {invRouter} from './inv/inv.routing';
import {finRouter} from './fin/fin.routing';
import {userRouter} from './core/user/user.routing';

const express = require('express');

export const router = express.Router();

export class Routes {

    public static init(app: Application) {

        app.use('/inv', invRouter);
        app.use('/fin', finRouter);
        app.use('/user', userRouter);

    }
}
