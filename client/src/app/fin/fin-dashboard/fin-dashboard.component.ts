import {Component, OnInit} from '@angular/core';
import {AccountBalance, FinService} from "../fin.service";
import {chartColors} from "../../core/chart-colors";

@Component({
    selector: 'app-fin-dashboard',
    templateUrl: './fin-dashboard.component.html',
    styleUrls: ['./fin-dashboard.component.css']
})
export class FinDashboardComponent implements OnInit {

    expensesData: any;
    incomeData: any;
    options = {
        responsive: false,
        maintainAspectRatio: false
    };

    constructor(
        private readonly finService: FinService
    ) {
    }

    async ngOnInit() {
        let expenseBalances: AccountBalance[] = this.summarizeOther(await this.finService.getAccountBalancesByCategory(3));
        this.expensesData = {
            labels: expenseBalances.map(balance => balance.name),
            datasets: [
                {
                    data: expenseBalances.map(balance => balance.balance),
                    backgroundColor: chartColors
                }]
        };
        let incomeBalances: AccountBalance[] = this.summarizeOther(await this.finService.getAccountBalancesByCategory(6));
        this.incomeData = {
            labels: incomeBalances.map(balance => balance.name),
            datasets: [
                {
                    data: incomeBalances.map(balance => balance.balance),
                    backgroundColor: chartColors
                }]
        };
    }

    summarizeOther(balances: AccountBalance[]): AccountBalance[] {
        balances = balances
            .filter(balance => balance.balance > 0)
            .sort((a, b) => b.balance - a.balance);
        const other = balances.slice(10);
        balances = balances.slice(0, 10);

        let sumOther = 0;
        other.forEach(balance => {
            sumOther += balance.balance;
        });

        balances.push({
            balance: sumOther,
            name: "Other",
            id: null
        });
        return balances;
    }

}
