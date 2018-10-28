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
    messages: {severity: string, summary: string, detail: string}[] = [];

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

        this.messages = [];
        if(this.loginForm.valid) {
            try {
                const result: boolean = await this.authService.logIn(this.loginForm.get('username')!.value, this.loginForm.get('password')!.value);
                if (result) {
                    this.messages.push({severity: 'success', summary: 'Success', detail: 'Successfully logged in.'});
                    this.router.navigate(['home']);
                } else {
                    this.messages.push({severity: 'error', summary: 'Warn', detail: 'Invalid credentials provided.'});
                }
            } catch (e) {
                this.messages.push({severity: 'error', summary: 'Error', detail: e.error.message});
            }
        } else {
            this.messages.push({severity: 'error', summary: 'Error', detail: 'Please fill all fields'});
        }

    }

    async cancel() {
        await this.router.navigate(['/']);
    }

}
