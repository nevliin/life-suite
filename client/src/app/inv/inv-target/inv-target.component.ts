import {Component, OnInit} from '@angular/core';
import {map} from "rxjs/operators";
import {InvTargetEntry} from "../inv-target-entry";
import {HttpClient} from "@angular/common/http";
import {ErrorHandlingService} from "../../core/error-handling/error-handling.service";
import {InvService} from "../inv.service";

@Component({
    selector: 'app-inv-target',
    templateUrl: './inv-target.component.html',
    styleUrls: ['./inv-target.component.css']
})
export class InvTargetComponent implements OnInit {

    targetEntries: InvTargetEntry[] = [];

    constructor(
        readonly invService: InvService,
        readonly errorHandlingService: ErrorHandlingService
    ) {
    }

    async ngOnInit() {
        await this.fetchEntries();
    }

    async fetchEntries() {
        try {
            this.targetEntries = await this.invService.getTargetEntries();
        } catch (e) {
            this.errorHandlingService.handleHTTPError(e);
        }
    }

}
