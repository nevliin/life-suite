import {NextFunction, Request, Response, Router} from "express";
import {AuthService} from "./auth.service";
import {ISignUpModel} from "./model/signup.model";
import {ErrorCodeUtil} from "../utils/error-code/error-code.util";
import {ILoginModel} from "./model/login.model";
import {IUpdatePasswordModel} from "./model/update-password.model";
import {IEditRolesModel} from "./model/edit-roles.model";
import {CRUDConstructor} from "../core/crud/crud-constructor";
import {RoleModel} from "./model/role.model";
import {IUserDetailsModel} from "./model/user-details.model";
import {ValidatorUtil} from "../utils/validator/validator.util";

const express = require('express');

const authCookieName: string = 'auth_token';

export const init = (): Router => {
    const authRouter = express.Router();
    authRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: number = await AuthService.signUp((<ISignUpModel>req.body));
            res.status(200).send({
                userId: userId
            })
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token: string = await AuthService.login(<ILoginModel>req.body);
            if ((<ILoginModel>req.body).rememberMe) {
                res.cookie(authCookieName, token, {maxAge: 30*24*60*60*1000}).status(200).send({
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

    authRouter.get('/logout', async (req: Request, res: Response, next: NextFunction) => {
        try {
            await AuthService.logOut(req.cookies[authCookieName]);
            res.cookie(authCookieName, '', {expires: new Date()});
            res.status(200).send({
                success: true
            })
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    authRouter.get('/verify', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result: boolean = await AuthService.verifyLogin(req.cookies[authCookieName]);
            res.status(200).send({
                valid: result
            })
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    authRouter.post('/updatePassword', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: number = await AuthService.updatePassword(<IUpdatePasswordModel>req.body);
            res.status(200).send({
                userId: userId
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    authRouter.post('/editRoles', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const success: boolean = await AuthService.editRoles(<IEditRolesModel>req.body);
            res.status(200).send({
                success: success
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    authRouter.get('/userDetails/:userId', async (req: Request, res: Response, next: NextFunction) => {
        try {
            ValidatorUtil.valNum(req.params.userId);
            const userDetails: IUserDetailsModel = await AuthService.getUserDetails(req.params.userId);
            res.status(200).send({
                userDetails: userDetails
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    const roleModelCRUD: CRUDConstructor<RoleModel> = new CRUDConstructor<RoleModel>(new RoleModel(), 'auth_role', {
        autoIncrementId: true,
        autoFilledFields: [
            'created_on'
        ]
    });
    authRouter.use('/role', roleModelCRUD.getRouter());

    return authRouter;
};

export const authRouter = init();

