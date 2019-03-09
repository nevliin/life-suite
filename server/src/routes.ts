import {Application} from 'express';
import {invRouter} from './inv/inv.routing';
import {finRouter} from './fin/fin.routing';
import {userRouter} from './core/user/user.routing';
import {authRouter} from './core/auth/auth.routing';
import {docRouter} from './doc/doc.routing';

const express = require('express');

export const router = express.Router();

export class Routes {

    public static init(app: Application) {

        app.use('/inv', invRouter());
        app.use('/fin', finRouter());
        app.use('/user', userRouter());
        app.use('/auth', authRouter());
        app.use('/doc', docRouter());
    }
}
