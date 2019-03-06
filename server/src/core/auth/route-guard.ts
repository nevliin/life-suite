import {NextFunction, Request, Response} from 'express';
import {RouteWithPermissionsModel} from './model/route-with-permissions.model';
import {ErrorCodeUtil} from '../../utils/error-code/error-code.util';
import {Singletons} from '../singletons';
import {CoreTypes} from '../core.types';
import {AuthService} from './auth.service';

/**
 * Router middleware that verifies the validity of the JWT token in the header auth-token and checks if the user
 * has access to the route; responds with an error if the token is invalid or the user has no access to this route
 * @param req
 * @param res
 * @param next
 */
export async function routeGuard(req: Request, res: Response, next: NextFunction) {
    const authService: AuthService = Singletons.get(CoreTypes.AuthService);
    try {
        if (req.cookies.auth_token) {
            const userId: number = await authService.verifyToken(req.cookies.auth_token);
            const route: RouteWithPermissionsModel = authService.isRouteGuarded(req.path);
            if (await authService.verifyRoutePermission(route, userId)) {
                next();
            } else {
                ErrorCodeUtil.resolveErrorOnRoute(ErrorCodeUtil.findErrorCode('ACC_DENIED'), res);
            }
        } else {
            const route: RouteWithPermissionsModel = authService.isRouteGuarded(req.path);
            if (await authService.verifyRoutePermission(route, null)) {
                next();
            } else {
                ErrorCodeUtil.resolveErrorOnRoute(ErrorCodeUtil.findErrorCode('ACC_DENIED'), res);
            }
        }
    } catch (e) {
        console.error(e);
        ErrorCodeUtil.resolveErrorOnRoute(ErrorCodeUtil.findErrorCode('ACC_DENIED'), res);
    }
}