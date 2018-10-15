import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Http} from "@angular/http";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {jsonpCallbackContext} from "@angular/common/http/src/module";

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
    readonly router: Router
  ) {

  }

  ngOnInit() {
  }

  async submit() {
    console.log(this.loginForm.get('username')!.value);
    this.http.post('/api/auth/login', {
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value
    }).subscribe(response => console.log(response));
  }

  async cancel() {
    await this.router.navigate([]);
  }

}
