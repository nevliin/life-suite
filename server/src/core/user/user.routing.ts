import {NextFunction, Request, Response, Router} from 'express';
import {UserService} from './user.service';
import {ErrorCodeUtil} from '../../utils/error-code/error-code.util';
import {IUserDetailsModel} from './model/user-details.model';
import {ValidatorUtil} from '../../utils/validator/validator.util';
import {CRUDConstructor} from '../crud/crud-constructor';
import {UserModel} from './model/user.model';
import {IServerConfig} from '../../assets/config/server-config.model';
import {AuthService} from '../auth/auth.service';

const express = require('express');
const config: IServerConfig = require('../../assets/config/server-config.json');

export const init = (): Router => {
    const userRouter = express.Router();

    userRouter.get('/self', async (req: Request, res: Response, next: NextFunction) => {
        try {
            let userId: number | undefined;
            if (req.cookies && req.cookies.auth_token) {
                userId = await AuthService.verifyToken(req.cookies.auth_token);
            }
            let userDetails: IUserDetailsModel | undefined;
            if (userId) {
                userDetails = await UserService.getUserDetails(userId);
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
            const userDetails: IUserDetailsModel = await UserService.getUserDetails(req.params.userId);
            res.status(200).send({
                userDetails: userDetails
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    const userModelCRUD: CRUDConstructor<UserModel> = new CRUDConstructor<UserModel>(new UserModel(), 'auth_user', 'user',{
        autoIncrementId: true,
        autoFilledFields: [
            'created_on'
        ],
        dbConfig: config.auth
    });
    userRouter.use('/crud', userModelCRUD.getRouter());

    return userRouter;
};

export const userRouter = init();

