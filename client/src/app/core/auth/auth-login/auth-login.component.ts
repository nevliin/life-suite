import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";
import {MessageService} from "primeng/api";
import {ErrorHandlingService} from "../../error-handling/error-handling.service";
import {isNullOrUndefined} from "util";

@Component({
    selector: 'auth-login',
    templateUrl: './auth-login.component.html',
    styleUrls: ['./auth-login.component.css']
})
export class AuthLoginComponent implements OnInit {

    @Input() intendedRoute: string[];

    loginForm: FormGroup = this.fb.group({
        'username': ['', Validators.required],
        'password': ['', Validators.required],
        'rememberMe': [true]
    });
    messages: {severity: string, summary: string, detail: string}[] = [];

    constructor(
        readonly fb: FormBuilder,
        readonly http: HttpClient,
        readonly router: Router,
        readonly authService: AuthService,
        readonly messageService: MessageService,
        private readonly errorHandlingService: ErrorHandlingService
    ) {

    }

    ngOnInit() {
    }

    async submit() {
        this.messages = [];
        if(this.loginForm.valid) {
            try {
                const result: boolean = await this.authService.logIn(this.loginForm.get('username')!.value, this.loginForm.get('password')!.value, this.loginForm.get('rememberMe')!.value);
                if (result) {
                    this.navigateIntended();
                    this.messageService.add({ severity: 'success', summary: 'Logged in', detail: 'Login was successful!', life: 3000, closable: true});
                } else {
                    this.messages.push({severity: 'warn', summary: 'Warning', detail: 'Invalid credentials provided.'});
                }
            } catch (e) {
                this.messages.push({severity: 'error', summary: 'Error', detail: this.errorHandlingService.getMessageFromHTTPError(e)});
            }
        } else {
            this.messages.push({severity: 'warn', summary: 'Warning', detail: 'Please fill all fields'});
        }
    }

    navigateIntended() {
        if(!isNullOrUndefined(this.intendedRoute)) {
            this.router.navigate(this.intendedRoute);
        } else {
            this.router.navigate(['/']);
        }
    }

    async cancel() {
        await this.router.navigate(['/']);
    }

}
