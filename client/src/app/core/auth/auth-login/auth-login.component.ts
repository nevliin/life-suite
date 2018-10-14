import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Http} from "@angular/http";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

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
    this.http.post('k-kohlen.com/api/auth/login', {
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value
    });
  }

  async cancel() {
    await this.router.navigate([]);
  }

}
