import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";
import {MessageService} from "primeng/api";

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
        readonly messageService: MessageService
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
                    this.messages.push({severity: 'success', summary: 'Success', detail: 'Successfully logged in.'});
                    this.navigateIntended();
                    this.messageService.add({ severity: 'success', summary: 'Logged in', detail: 'Login was successful!', life: 3000, closable: true});
                } else {
                    this.messages.push({severity: 'error', summary: 'Warn', detail: 'Invalid credentials provided.'});
                }
            } catch (e) {
                this.messages.push({severity: 'error', summary: 'Error', detail: e.message});
            }
        } else {
            this.messages.push({severity: 'error', summary: 'Error', detail: 'Please fill all fields'});
        }
    }

    navigateIntended() {
        if(this.intendedRoute !== undefined) {
            this.router.navigate(this.intendedRoute);
        } else {
            this.router.navigate(['home']);
        }
    }

    async cancel() {
        await this.router.navigate(['/']);
    }

}
