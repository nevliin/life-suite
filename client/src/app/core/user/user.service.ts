import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserDetail} from './user-detail';
import {map} from 'rxjs/operators';
import {AuthService} from '../auth/auth.service';
import {TwoWayMap} from '../auth/two-way-map';

const API_ROOT: string = '/api/user/';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(
        private readonly http: HttpClient,
        private readonly authService: AuthService
    ) {
    }

    async getSelfDetails(): Promise<UserDetail> {
        return await this.http.get(API_ROOT + 'self').pipe(map((res: { userDetails: UserDetail }) => {
            res.userDetails.createdOn = new Date(res.userDetails.createdOn);
            res.userDetails.lastLogin = new Date(res.userDetails.lastLogin);
            return res.userDetails;
        })).toPromise();
    }

    async roleIdsToRoleNames(ids: number[]): Promise<string[]> {
        const rolesMap: TwoWayMap<number, string> = await this.authService.getRolesMap();
        return ids.map(id => {
            return rolesMap.get(id);
        });
    }

}
