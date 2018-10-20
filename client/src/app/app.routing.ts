import {Injectable, NgModule} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterModule, RouterStateSnapshot, Routes} from "@angular/router";
import {AuthLoginComponent} from "./core/auth/auth-login/auth-login.component";
import {PageNotFoundComponent} from "./core/error-handling/page-not-found/page-not-found.component";
import {InvListComponent} from "./inv/inv-list/inv-list.component";
import {InvComparisonComponent} from "./inv/inv-comparison/inv-comparison.component";
import {CurrentMenuResolver} from "./core/menu/current-menu.resolver";
import {InvTargetComponent} from "./inv/inv-target/inv-target.component";
import {InvExpirationsComponent} from "./inv/inv-expirations/inv-expirations.component";

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
    resolve: {
      menu: CurrentMenuResolver
    },
    children: [
      {
        path: 'list', component: InvListComponent
      },
      {
        path: 'comparison', component: InvComparisonComponent
      },
      {
        path: 'target', component: InvTargetComponent
      },
      {
        path: 'expirations', component: InvExpirationsComponent
      },
      {
        path: '', redirectTo: 'list', pathMatch: 'full'
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
