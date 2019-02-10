import {Component, OnInit} from '@angular/core';
import {FinService} from '../../fin.service';
import {MatDialog} from '@angular/material';
import {DoYearlyCloseComponent} from '../do-yearly-close/do-yearly-close.component';

@Component({
    selector: 'app-yearly-closes-banner',
    templateUrl: './yearly-closes-banner.component.html',
    styleUrls: ['./yearly-closes-banner.component.css']
})
export class YearlyClosesBannerComponent implements OnInit {

    unfinishedYears: number[] = [];

    constructor(
        private readonly finService: FinService,
        private readonly matDialog: MatDialog
    ) {
    }

    async ngOnInit() {
        await this.fetchUnfinishedYears();
    }

    async onClick() {
        await this.matDialog.open(DoYearlyCloseComponent, {
            panelClass: 'minimal-dialog-content'
        }).afterClosed().toPromise();
        await this.fetchUnfinishedYears();
    }

    async fetchUnfinishedYears() {
        this.unfinishedYears = await this.finService.unfinishedYears();
    }
}
