import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";

@Component({
    selector: 'app-auth-login',
    templateUrl: './auth-login.component.html',
    styleUrls: ['./auth-login.component.css']
})
export class AuthLoginComponent implements OnInit {
    loginForm: FormGroup = this.fb.group({
        'username': ['', Validators.required],
        'password': ['', Validators.required]
    });

    constructor(
        readonly fb: FormBuilder,
        readonly http: HttpClient,
        readonly router: Router,
        readonly authService: AuthService
    ) {

    }

    ngOnInit() {
    }

    async submit() {
        await this.authService.logIn(this.loginForm.get('username')!.value, this.loginForm.get('password')!.value);
    }

    async cancel() {
        await this.router.navigate([]);
    }

}
