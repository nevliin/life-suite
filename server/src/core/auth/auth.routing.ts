import {NextFunction, Request, Response, Router} from 'express';
import {AuthService} from './auth.service';
import {ISignUpModel} from './model/signup.model';
import {ErrorCodeUtil} from '../../utils/error-code/error-code.util';
import {ILoginModel} from './model/login.model';
import {IUpdatePasswordModel} from './model/update-password.model';
import {EditRolesModel} from './model/edit-roles.model';
import {DIContainer} from '../di-container';
import {CoreTypes} from '../core.types';

const express = require('express');
const authCookieName: string = 'auth_token';

export const authRouter = (): Router => {
    const authRouter = express.Router();

    const authService: AuthService = DIContainer.get(CoreTypes.AuthService);

    authRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: number = await authService.signUp((<ISignUpModel>req.body));
            res.status(200).send({
                userId: userId
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token: string = await authService.login(<ILoginModel>req.body);
            if ((<ILoginModel>req.body).rememberMe) {
                res.cookie(authCookieName, token, {maxAge: 30 * 24 * 60 * 60 * 1000}).status(200).send({
                    success: true
                });
            } else {
                res.cookie(authCookieName, token).status(200).send({
                    success: true
                });
            }
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    authRouter.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
        try {
            await authService.logOut(req.cookies[authCookieName]);
            res.cookie(authCookieName, '', {expires: new Date()});
            res.status(200).send({
                success: true
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    authRouter.get('/verify', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result: boolean = await authService.verifyLogin(req.cookies[authCookieName]);
            res.status(200).send({
                valid: result
            });
        } catch (e) {
            console.error(e);
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    authRouter.post('/updatePassword', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: number = await authService.updatePassword(<IUpdatePasswordModel>req.body);
            res.status(200).send({
                userId: userId
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    authRouter.post('/editRoles', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const success: boolean = await authService.editRoles(<EditRolesModel>req.body);
            res.status(200).send({
                success: success
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    authRouter.use('/role', DIContainer.get(CoreTypes.RoleCRUD).getRouter());

    return authRouter;
};


