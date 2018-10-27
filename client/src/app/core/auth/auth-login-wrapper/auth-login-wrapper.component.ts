import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";

@Component({
    selector: 'app-auth-login-wrapper',
    templateUrl: './auth-login-wrapper.component.html',
    styleUrls: ['./auth-login-wrapper.component.css']
})
export class AuthLoginWrapperComponent implements OnInit {

    verified: boolean;
    constructor(
        readonly authService: AuthService
    ) {

    }

    ngOnInit() {
    }

}
