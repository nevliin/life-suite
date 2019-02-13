import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './core/error-handling/page-not-found/page-not-found.component';
import {InvListComponent} from './inv/inv-list/inv-list.component';
import {InvComparisonComponent} from './inv/inv-comparison/inv-comparison.component';
import {CurrentMenuResolver} from './core/menu/current-menu.resolver';
import {InvTargetComponent} from './inv/inv-target/inv-target.component';
import {InvExpirationsComponent} from './inv/inv-expirations/inv-expirations.component';
import {AuthService} from './core/auth/auth.service';
import {AuthLoginWrapperComponent} from './core/auth/auth-login-wrapper/auth-login-wrapper.component';
import {DashboardComponent} from './dashboard/dashboard/dashboard.component';
import {FinRecentComponent} from './fin/fin-recent/fin-recent.component';
import {FinTransactionEditComponent} from './fin/fin-transaction-edit/fin-transaction-edit.component';
import {FinAccountsComponent} from './fin/fin-accounts/fin-accounts.component';
import {FinAccountSearchComponent} from './fin/fin-account-search/fin-account-search.component';
import {FinAccountDetailComponent} from './fin/fin-account-detail/fin-account-detail.component';
import {FinDashboardComponent} from './fin/fin-dashboard/fin-dashboard.component';
import {InvStockListComponent} from './inv/inv-stock-list/inv-stock-list.component';
import {InvWrapperComponent} from './inv/inv-wrapper/inv-wrapper.component';
import {CurrentStockResolver} from './inv/current-stock.resolver';
import {InvAddEntryComponent} from './inv/inv-add-entry/inv-add-entry.component';
import {UserDetailsComponent} from './core/user/user-details/user-details.component';
import {FinManageTemplatesComponent} from './fin/fin-manage-templates/fin-manage-templates.component';

const routes: Routes = [
    {
        path: 'home',
        canActivate: [AuthService],
        resolve: {
            menu: CurrentMenuResolver
        },
        data: {
            requiredPower: 1
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
        path: 'user',
        data: {
            requiredPower: 1,
            permittedRoles: []
        },
        children: [
            {
                path: 'details',
                component: UserDetailsComponent
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
            requiredPower: 50,
            permittedRoles: ['inv']
        },
        children: [
            {
                path: '', pathMatch: 'full', component: InvStockListComponent
            },
            {
                path: ':stockId',
                component: InvWrapperComponent,
                resolve: {
                    stockId: CurrentStockResolver
                },
                children: [
                    {
                        path: 'list', component: InvListComponent, outlet: 'inv'
                    },
                    {
                        path: 'comparison', component: InvComparisonComponent, outlet: 'inv'
                    },
                    {
                        path: 'target', component: InvTargetComponent, outlet: 'inv'
                    },
                    {
                        path: 'expirations', component: InvExpirationsComponent, outlet: 'inv'
                    },
                    {
                        path: 'add', component: InvAddEntryComponent, outlet: 'inv'
                    },
                    {
                        path: '', redirectTo: 'list', pathMatch: 'full'
                    }
                ]
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
            requiredPower: 20,
            permittedRoles: ['fin']
        },
        children: [
            {
                path: 'dashboard', component: FinDashboardComponent
            },
            {
                path: 'add', component: FinTransactionEditComponent
            },
            {
                path: 'recent', component: FinRecentComponent
            },
            {
                path: 'accounts', component: FinAccountsComponent
            },
            {
                path: 'account-search', component: FinAccountSearchComponent
            },
            {
                path: 'account/:accountId', component: FinAccountDetailComponent
            },
            {
                path: 'templates', component: FinManageTemplatesComponent
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
