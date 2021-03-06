import {NextFunction, Request, Response, Router} from 'express';
import {UserService} from './user.service';
import {ErrorCodeUtil} from '../../utils/error-code/error-code.util';
import {IUserDetailsModel} from './model/user-details.model';
import {ValidatorUtil} from '../../utils/validator/validator.util';
import {CRUDConstructor} from '../crud/crud-constructor';
import {UserModel} from './model/user.model';
import {ServerConfig} from '../config/server-config.model';
import {DIContainer} from '../di-container';
import {CoreTypes} from '../core.types';
import {AuthService} from '../auth/auth.service';

const express = require('express');
const config: ServerConfig = require('../../assets/server-config.json');

export const userRouter = (): Router => {
    const userRouter = express.Router();
    const authService: AuthService = DIContainer.get(CoreTypes.AuthService);
    const userService: UserService = DIContainer.get(CoreTypes.UserService);
    const userCRUD: CRUDConstructor<UserModel> = DIContainer.get(CoreTypes.UserCRUD);

    userRouter.get('/self', async (req: Request, res: Response, next: NextFunction) => {
        try {
            let userId: number | undefined;
            if (req.cookies && req.cookies.auth_token) {
                userId = await authService.verifyToken(req.cookies.auth_token);
            }
            let userDetails: IUserDetailsModel | undefined;
            if (userId) {
                userDetails = await userService.getUserDetails(userId);
            }
            res.status(200).send({
                userDetails: userDetails
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    userRouter.get('/details/:userId', async (req: Request, res: Response, next: NextFunction) => {
        try {
            ValidatorUtil.valNum(req.params.userId);
            const userDetails: IUserDetailsModel = await userService.getUserDetails(req.params.userId);
            res.status(200).send({
                userDetails: userDetails
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    userRouter.use('/crud', userCRUD.getRouter());

    return userRouter;
};


