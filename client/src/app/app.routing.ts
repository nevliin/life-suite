import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AuthLoginComponent} from "./core/auth/auth-login/auth-login.component";
import {PageNotFoundComponent} from "./core/error-handling/page-not-found/page-not-found.component";
import {InvListComponent} from "./inv/inv-list/inv-list.component";

const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login', component: AuthLoginComponent
      }
    ]
  },
  {
    path: 'inv',
    children: [
      {
        path: 'list', component: InvListComponent
      },
      {
        path: '', redirectTo: '/list', pathMatch: 'full'
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
export class AppRouting { }
