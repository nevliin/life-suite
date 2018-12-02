import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {PageNotFoundComponent} from "./core/error-handling/page-not-found/page-not-found.component";
import {InvListComponent} from "./inv/inv-list/inv-list.component";
import {InvComparisonComponent} from "./inv/inv-comparison/inv-comparison.component";
import {CurrentMenuResolver} from "./core/menu/current-menu.resolver";
import {InvTargetComponent} from "./inv/inv-target/inv-target.component";
import {InvExpirationsComponent} from "./inv/inv-expirations/inv-expirations.component";
import {InvAddComponent} from "./inv/inv-add/inv-add.component";
import {AuthService} from "./core/auth/auth.service";
import {AuthLoginWrapperComponent} from "./core/auth/auth-login-wrapper/auth-login-wrapper.component";
import {DashboardComponent} from "./dashboard/dashboard/dashboard.component";
import {FinRecentComponent} from "./fin/fin-recent/fin-recent.component";
import {FinAddComponent} from "./fin/fin-add/fin-add.component";
import {FinAccountsComponent} from "./fin/fin-accounts/fin-accounts.component";

const routes: Routes = [
    {
        path: 'home',
        resolve: {
            menu: CurrentMenuResolver
        },
        component: DashboardComponent
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
        path: 'fin',
        canActivate: [AuthService],
        resolve: {
            menu: CurrentMenuResolver
        },
        data: {
            requiredPower: 10
        },
        children: [
            {
                path: 'dashboard', component: InvListComponent
            },
            {
                path: 'add', component: FinAddComponent
            },
            {
                path: 'recent', component: FinRecentComponent
            },
            {
                path: 'accounts', component: FinAccountsComponent
            },
            {
                path: '', redirectTo: 'dashboard', pathMatch: 'full'
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
