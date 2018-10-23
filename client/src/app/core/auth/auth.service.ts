import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TwoWayMap} from "./two-way-map";
import {map} from "rxjs/operators";
import {ActivatedRouteSnapshot, CanActivate} from "@angular/router";
import decode from 'jwt-decode';
import {JwtPayload} from "./jwt-payload";
import {CookieService} from "../cookie.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate{

  roles: TwoWayMap<number, string>;
  verified: boolean;

  constructor(
    readonly http: HttpClient,
    readonly cookieService: CookieService
  ) {
  }

  /**
   * Only called once - I'M AWARE THIS IS SUBOPTIMAL
   */
  verifyUser() {
    this.http.get('/api/auth/verify').pipe(map((response: any) => {
      if(response.success !== true) {
        localStorage.removeItem('auth_token');
      }
    }));
    this.verified = true;
  }

  /**
   * Route guard, returns true if the user is logged in and has enough power or an appropriate role for the route
   * @param route
   */
  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    if(this.roles === undefined) {
      await this.fetchRoleIds();
    }
    if(!this.verified) {
      await this.verifyUser();
    }
    if(this.cookieService.readCookie('auth_token') !== '') {
      try {
        const jwtPayload: JwtPayload = decode(this.cookieService.readCookie('auth_token'));
        if (jwtPayload && jwtPayload.power) {
          if (jwtPayload.power >= route.data.requiredPower) {
            return true;
          }
        }
      } catch(e) {
        console.log(e);
        return false;
      }
    }
    return false;
  }

  /**
   * Get IDs of all roles
   */
  async fetchRoleIds() {
    await this.http.get('/api/auth/role/list').pipe(map((response: any) => {
      const tempMap: Map<number, string> = new Map();
      response.data.forEach((role: { name: string, id: number}) => {
        tempMap.set(role.id, role.name);
      });
      this.roles = new TwoWayMap(tempMap);
    })).toPromise();
  }

}
