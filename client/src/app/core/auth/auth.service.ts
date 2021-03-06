import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TwoWayMap} from './two-way-map';
import {map} from 'rxjs/operators';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import decode from 'jwt-decode';
import {JwtPayload} from './jwt-payload';
import {CookieService} from '../cookie.service';
import {BehaviorSubject} from 'rxjs';
import {isNullOrUndefined} from '../util';
import {MessageService} from 'primeng/api';
import {FinAccount} from '../../fin/fin-account';

const defaultPayload: JwtPayload = {
    power: 0,
    roles: [0],
    userId: -1
};

@Injectable({
    providedIn: 'root'
})
export class AuthService implements CanActivate {

    roles: TwoWayMap<number, string>;
    rolesPromise: Promise<void>;

    verified: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    verificationStarted: boolean;
    waitForVerification: Promise<void>;

    lastVerified: Date | null = null;
    cacheValidity: number = 60 * 1000;

    constructor(
        readonly http: HttpClient,
        readonly cookieService: CookieService,
        readonly router: Router,
        readonly messageService: MessageService
    ) {
    }

    async logIn(username: string, password: string, rememberMe: boolean): Promise<boolean> {
        const res: { success: boolean } = <{ success: boolean }>(await this.http.post('/api/auth/login', {
            username: username,
            password: password,
            rememberMe: rememberMe
        }).toPromise());
        if (!isNullOrUndefined(res.success)) {
            this.verified.next(res.success);
            return res.success;
        }
    }

    async logOut() {
        try {
            const res: { success: boolean } = <{ success: boolean }>await this.http.get('/api/auth/logout').toPromise();
            if (isNullOrUndefined(res.success) || !res.success) {
                this.cookieService.deleteCookie('auth_token');
            }
        } catch (e) {
            this.cookieService.deleteCookie('auth_token');
        }
        this.verified.next(false);
        window.location.reload();
    }

    async verifyUser(): Promise<boolean> {
        if (this.verificationStarted) {
            await this.waitForVerification;
            return this.verified.getValue();
        }

        if (this.lastVerified !== null
            && (this.lastVerified.getTime() + this.cacheValidity) > (new Date()).getTime()) {
            return true;
        }

        this.verificationStarted = true;
        let resolveFunc: Function = new Function();
        this.waitForVerification = new Promise(resolve => {
            resolveFunc = resolve;
        });

        let result: boolean = false;
        try {
            await this.http.get('/api/auth/verify').pipe(map((response: any) => {
                if (response.valid !== true) {
                    this.cookieService.deleteCookie('auth_token');
                    this.verified.next(false);
                } else {
                    this.lastVerified = new Date();
                    this.verified.next(true);
                    result = true;
                }
            })).toPromise();
        } catch (e) {
            this.verified.next(false);
        }
        resolveFunc();
        this.verificationStarted = false;
        return result;
    }

    async verifyUserLight(): Promise<boolean> {
        if (this.verified.getValue() === null) {
            await this.verifyUser();
            return this.verified.getValue();
        }
        return this.verified.getValue();
    }

    getVerification$(): BehaviorSubject<boolean> {
        if (this.verified.getValue() === null) {
            this.verifyUser().then();
        }
        return this.verified;
    }

    /**
     * Route guard, returns true if the user is logged in and has enough power or an appropriate role for the route
     * @param route
     */
    async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
        if (this.roles === undefined) {
            await this.fetchRoleIds();
        }
        const requiredPower: number = (!isNullOrUndefined(route.data.requiredPower)) ? route.data.requiredPower : 0;
        const permittedRoles: number[] = (!isNullOrUndefined(route.data.permittedRoles))
            ? route.data.permittedRoles.map((role: string) => this.roles.revGet(role)).filter((role: number) => !isNullOrUndefined(role))
            : [];

        const permitted: boolean | null = await this.isUserPermitted(permittedRoles, requiredPower);

        if (permitted === true) {
            return true;
        } else if (permitted === false) {
            this.messageService.add({
                severity: 'error',
                summary: 'Access Denied',
                detail: 'Your permissions do not meet the requirements for this route.',
                life: 3000,
                closable: true
            });
            return false;
        }
        await this.router.navigate(['/auth', 'login'], {queryParams: {intendedRoute: route.url}});
        return false;
    }

    async isUserPermitted(permittedRoles: number[], requiredPower: number): Promise<boolean | null> {
        if (this.roles === undefined) {
            await this.fetchRoleIds();
        }

        if (requiredPower === 0 || permittedRoles.includes(0)) {
            return true;
        }
        let jwtPayload: JwtPayload;

        const loggedInUser: boolean = await this.verifyUser();
        if (loggedInUser === true) {
            const cookie: string = this.cookieService.readCookie('auth_token');
            if (cookie !== '' && cookie !== undefined && cookie !== null) {
                try {
                    jwtPayload = decode(cookie);
                } catch (e) {
                    jwtPayload = defaultPayload;
                }
            } else {
                jwtPayload = defaultPayload;
            }
        } else {
            jwtPayload = defaultPayload;
        }
        if (jwtPayload.power >= requiredPower || permittedRoles.some((role: number) => jwtPayload.roles.includes(role))) {
            return true;
        } else if (loggedInUser) {
            return false;
        }
        return null;
    }

    async convertRoleNamesToIds(roles: string[]): Promise<number[]> {
        const rolesMap: TwoWayMap<number, string> = await this.getRolesMap();
        return roles.map((role: string) => {
            return rolesMap.revGet(role);
        });
    }

    /**
     * Get IDs of all roles
     */
    async fetchRoleIds() {
        await this.http.get('/api/auth/role/list').pipe(map((response: any) => {
            const tempMap: Map<number, string> = new Map();
            response.data.forEach((role: { name: string, id: number }) => {
                tempMap.set(role.id, role.name);
            });
            this.roles = new TwoWayMap(tempMap);
        })).toPromise();
    }

    async getRolesMap(forceReload?: boolean): Promise<TwoWayMap<number, string>> {
        if (this.roles !== undefined && !forceReload) {
            return this.roles;
        }
        if (this.rolesPromise !== undefined && !forceReload) {
            await this.rolesPromise;
            return this.roles;
        }
        if (this.roles === undefined || forceReload) {
            let resolveFunc: Function;
            this.rolesPromise = new Promise(resolve => {
                resolveFunc = resolve;
            });
            const roles: any[] = await this.http.get('/api/auth/role/list')
                .pipe(map((response: { data: FinAccount[] }) => {
                        return response.data;
                    })
                ).toPromise().catch((e) => {
                    console.log(e);
                    return [];
                });
            const rolesByName: Map<number, string> = new Map<number, string>();
            roles.forEach((role: any) => {
                rolesByName.set(role.id, role.name);
            });
            this.roles = new TwoWayMap(rolesByName);
            resolveFunc();
        }
        return this.roles;
    }


}
