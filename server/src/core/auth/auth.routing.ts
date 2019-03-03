import {NextFunction, Request, Response, Router} from 'express';
import {AuthService} from './auth.service';
import {ISignUpModel} from './model/signup.model';
import {ErrorCodeUtil} from '../../utils/error-code/error-code.util';
import {ILoginModel} from './model/login.model';
import {IUpdatePasswordModel} from './model/update-password.model';
import {IEditRolesModel} from './model/edit-roles.model';
import {CRUDConstructor} from '../crud/crud-constructor';
import {RoleModel} from './model/role.model';
import {controller, httpGet, httpPost, interfaces} from 'inversify-express-utils';
import Controller = interfaces.Controller;
import {inject} from 'inversify';
import {CoreTypes} from '../core.types';

const authCookieName: string = 'auth_token';

@controller('/auth')
export class AuthController implements Controller {

    @inject(CoreTypes.AuthService) authService: AuthService;

    @httpPost('/signup')
    private async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const userId: number = await AuthService.signUp((<ISignUpModel>req.body));
            res.status(200).send({
                userId: userId
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    }

    @httpPost('/login')
    private async login(req: Request, res: Response, next: NextFunction) {
        try {
            const token: string = await AuthService.login(<ILoginModel>req.body);
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
    }

    @httpPost('/logout')
    private async logOut(req: Request, res: Response, next: NextFunction) {
        try {
            await AuthService.logOut(req.cookies[authCookieName]);
            res.cookie(authCookieName, '', {expires: new Date()});
            res.status(200).send({
                success: true
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    }

    @httpGet('/verify')
    private async verify(req: Request, res: Response, next: NextFunction) {
        console.log('hi');
        try {
            const result: boolean = await this.authService.verifyLogin(req.cookies[authCookieName]);
            res.status(200).send({
                valid: result
            });
        } catch (e) {
            console.error(e);
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    }

    @httpPost('/updatePassword')
    private async updatePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const userId: number = await AuthService.updatePassword(<IUpdatePasswordModel>req.body);
            res.status(200).send({
                userId: userId
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    }

    @httpPost('/editRoles')
    private async editRoles(req: Request, res: Response, next: NextFunction) {
        try {
            const success: boolean = await AuthService.editRoles(<IEditRolesModel>req.body);
            res.status(200).send({
                success: success
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    }

    constructor() {
        const roleModelCRUD: CRUDConstructor<RoleModel> = new CRUDConstructor<RoleModel>(new RoleModel(), 'auth_role', 'role', {
            autoIncrementId: true,
            autoFilledFields: [
                'created_on'
            ]
        });
    }
}


