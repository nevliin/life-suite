import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {AuthLoginComponent} from "./core/auth/auth-login/auth-login.component";
import {PageNotFoundComponent} from "./core/error-handling/page-not-found/page-not-found.component";

const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: AuthLoginComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: '/front',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
