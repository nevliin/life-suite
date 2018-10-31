import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AuthLoginComponent} from "./core/auth/auth-login/auth-login.component";
import {PageNotFoundComponent} from "./core/error-handling/page-not-found/page-not-found.component";
import {InvListComponent} from "./inv/inv-list/inv-list.component";
import {InvComparisonComponent} from "./inv/inv-comparison/inv-comparison.component";
import {CurrentMenuResolver} from "./core/menu/current-menu.resolver";
import {InvTargetComponent} from "./inv/inv-target/inv-target.component";
import {InvExpirationsComponent} from "./inv/inv-expirations/inv-expirations.component";
import {InvAddComponent} from "./inv/inv-add/inv-add.component";
import {AuthService} from "./core/auth/auth.service";
import {AuthLoginWrapperComponent} from "./core/auth/auth-login-wrapper/auth-login-wrapper.component";
import {HomeDashboardComponent} from "./home/home-dashboard/home-dashboard.component";

const routes: Routes = [
    {
        path: 'home',
        resolve: {
            menu: CurrentMenuResolver
        },
        component: HomeDashboardComponent
    },
    {
        path: 'auth',
        resolve: {
            menu: CurrentMenuResolver
        },
        children: [
            {
                path: 'login', component: AuthLoginWrapperComponent
            }
        ]
    },
    {
        path: 'inv',
        canActivate: [AuthService],
        resolve: {
            menu: CurrentMenuResolver
        },
        data: {
            requiredPower: 50
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
                path: 'add', component: InvAddComponent
            },
            {
                path: '', redirectTo: 'list', pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: '**',
        resolve: {
            menu: CurrentMenuResolver
        },
        component: PageNotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRouting {
}
