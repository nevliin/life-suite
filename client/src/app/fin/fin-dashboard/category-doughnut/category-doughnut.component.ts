import {Component, Input, OnInit} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {AccountBalance, FinService} from '../../fin.service';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {chartColors} from '../../../core/chart-colors';

@Component({
  selector: 'app-category-doughnut',
  templateUrl: './category-doughnut.component.html',
  styleUrls: ['./category-doughnut.component.css']
})
export class CategoryDoughnutComponent implements OnInit {

    @Input() categoryId: number;
    @Input() title: string;

    doughnutWidth: number = 400;
    loading: boolean = false;

    amountsTotal: number;
    amountsData: any;
    options = {
        responsive: false,
        maintainAspectRatio: false
    };

    amountsTimeframe: Subject<Date> = new Subject();

    amountsSubscription: Subscription;

    constructor(
        private readonly finService: FinService,
        private readonly breakpointObserver: BreakpointObserver
    ) {
        this.amountsTimeframe.subscribe(async (startFrom: Date) => {
            if (this.amountsSubscription) {
                this.amountsSubscription.unsubscribe();
            }
            this.loading = true;
            this.amountsSubscription = this.finService.getAccountBalancesByCategory(this.categoryId, startFrom).subscribe(value => {
                this.amountsTotal = value.map(accountBalance => accountBalance.balance).reduce((a, b) => a + b);
                const expenseBalances: AccountBalance[] = this.summarizeOther(value);
                this.amountsData = {
                    labels: expenseBalances.map(balance => balance.name),
                    datasets: [
                        {
                            data: expenseBalances.map(balance => balance.balance),
                            backgroundColor: chartColors
                        }]
                };
                this.loading = false;
            });
        });
    }

    async ngOnInit() {
        this.breakpointObserver
            .observe([Breakpoints.Small])
            .subscribe((state: BreakpointState) => {
                if (state.matches) {
                    this.doughnutWidth = 400;
                } else {
                    this.doughnutWidth = 296;
                }
            });
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
            name: 'Other',
            id: null
        });
        return balances;
    }
}
