import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-auth-login-wrapper',
    templateUrl: './auth-login-wrapper.component.html',
    styleUrls: ['./auth-login-wrapper.component.css']
})
export class AuthLoginWrapperComponent implements OnInit {

    intendedRoute: string[];

    verifying: boolean = true;
    verified: boolean;

    constructor(
        readonly authService: AuthService,
        readonly route: ActivatedRoute,
        readonly router: Router
    ) {
        this.route.queryParams.subscribe((params => {
            if(Array.isArray(params['intendedRoute'])) {
                this.intendedRoute = params['intendedRoute'];
            } else {
                this.intendedRoute = [params['intendedRoute']];
            }
        }))
    }

    async ngOnInit() {
        this.verified = await this.authService.verifyUser();
        this.verifying = false;
    }

    async logOut() {
        await this.authService.logOut();
        this.verified = false;
    }

}
