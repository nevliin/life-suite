import {NextFunction, Request, Response, Router} from "express";
import {AuthUtil} from "../utils/auth/auth.util";
import {ISignUpModel} from "../utils/auth/signup.model";
import {ErrorCodeUtil} from "../utils/error-code/error-code.util";
import {ILoginModel} from "../utils/auth/login.model";
import {IUpdatePasswordModel} from "../utils/auth/update-password.model";

const express = require('express');

export const init = (): Router => {
    const authRouter = express.Router();
    authRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: number = await AuthUtil.signUp((<ISignUpModel>req.body));
            res.status(200).send({
                userId: userId
            })
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token: string = await AuthUtil.login(<ILoginModel>req.body);
            if((<ILoginModel>req.body).rememberMe) {
                res.cookie('auth_token', token, {maxAge: 2592000000}).status(200).send({
                    success: true
                });
            } else {
                res.cookie('auth_token', token).status(200).send({
                    success: true
                });
            }
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    authRouter.get('/logout', async (req: Request, res: Response, next: NextFunction) => {
        try {
            await AuthUtil.logOut(req.cookies['auth_token']);
            res.status(200).send({
                success: true
            })
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    authRouter.get('/verify', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result: boolean = await AuthUtil.verifyLogin(req.cookies['auth_token']);
            res.status(200).send({
                valid: result
            })
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    authRouter.post('/updatePassword', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: number = await AuthUtil.updatePassword(<IUpdatePasswordModel>req.body);
            res.status(200).send({
                userId: userId
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    return authRouter;
};

export const authRouter = init();

