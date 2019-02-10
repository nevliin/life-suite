import {Component, OnInit} from '@angular/core';
import {FinService} from '../../fin.service';
import {MatDialogRef} from '@angular/material';

interface YearDisplay {
    year: number;
    done: boolean;
}

const minimumYear: number = 2018;

@Component({
    selector: 'app-do-yearly-close',
    templateUrl: './do-yearly-close.component.html',
    styleUrls: ['./do-yearly-close.component.css']
})
export class DoYearlyCloseComponent implements OnInit {

    years: YearDisplay[] = [];

    constructor(
        private readonly finService: FinService,
        public dialogRef: MatDialogRef<DoYearlyCloseComponent>,
    ) {
    }

    async ngOnInit() {
        await this.fetchYears();
    }

    async fetchYears() {
        const unfinishedYears: number[] = await this.finService.unfinishedYears();
        this.years = [];
        let tempYear = minimumYear;
        while (tempYear < new Date().getUTCFullYear()) {
            this.years.push({
                year: tempYear,
                done: !unfinishedYears.includes(tempYear)
            });
            tempYear++;
        }
    }

    close() {
        this.dialogRef.close();
    }

    async doYearlyClose(year: number) {
        try {
            await this.finService.doYearlyClose(year);
            await this.fetchYears();
        } catch (e) {
            console.error(e);
        }
    }

}
