import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatSelectChange} from '@angular/material';
import {Time} from '@angular/common';

export interface TimeFrameOption {
    label: string;
    value: TimeFrameOptions;
    startDate: Date;
}

@Component({
    selector: 'app-time-frame-select',
    templateUrl: './time-frame-select.component.html',
    styleUrls: ['./time-frame-select.component.css']
})
export class TimeFrameSelectComponent implements OnInit {

    timeFrameOptions: TimeFrameOption[] = [
        {
            label: 'Current Month',
            value: TimeFrameOptions.CURRENT_MONTH,
            startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        },
        {
            label: 'Last Month',
            value: TimeFrameOptions.LAST_MONTH,
            startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getUTCDate())
        },
        {
            label: 'Current Year',
            value: TimeFrameOptions.CURRENT_YEAR,
            startDate: new Date(new Date().getFullYear(), 0, 1)
        },
        {
            label: 'Last Year',
            value: TimeFrameOptions.LAST_YEAR,
            startDate: new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getUTCDate())
        }
    ];

    @Output() onSelection: EventEmitter<Date> = new EventEmitter();

    @Input() set defaultValue(value: TimeFrameOptions) {
        this._value = value;
        this.onSelectionEmit(value);
    }

    set value(value: TimeFrameOptions) {
        this._value = value;
    }

    get value(): TimeFrameOptions {
        return this._value;
    }

    lastValue: TimeFrameOptions;
    _value: TimeFrameOptions = TimeFrameOptions.CURRENT_MONTH;

    constructor() {
    }

    ngOnInit() {
    }

    onSelectionEmit(event: TimeFrameOptions) {
        if (event && event !== this.lastValue) {
            this.lastValue = event;
            this.onSelection.emit(this.timeFrameOptions.find(option => option.value === event).startDate);
        }
    }

}

export enum TimeFrameOptions {
    CURRENT_MONTH = 'currentMonth',
    LAST_MONTH = 'lastMonth',
    CURRENT_YEAR = 'currentYear',
    LAST_YEAR = 'lastYear'
}
