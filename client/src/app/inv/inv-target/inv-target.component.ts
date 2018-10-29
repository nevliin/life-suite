import {Component, OnInit} from '@angular/core';
import {map} from "rxjs/operators";
import {InvTargetEntry} from "../inv-target-entry";
import {HttpClient} from "@angular/common/http";
import {ErrorHandlingService} from "../../core/error-handling/error-handling.service";

@Component({
    selector: 'app-inv-target',
    templateUrl: './inv-target.component.html',
    styleUrls: ['./inv-target.component.css']
})
export class InvTargetComponent implements OnInit {

    targetEntries: InvTargetEntry[] = [];

    constructor(
        readonly http: HttpClient,
        readonly errorHandlingService: ErrorHandlingService
    ) {
    }

    async ngOnInit() {
        await this.fetchEntries();
    }

    async fetchEntries() {
        try {
            this.targetEntries = await this.http.get('/api/inv/targetEntry/list')
                .pipe(map((response: { data: InvTargetEntry[] }) => response.data)
                ).toPromise();
        } catch (e) {
            this.errorHandlingService.handleHTTPError(e);
        }
    }

}
