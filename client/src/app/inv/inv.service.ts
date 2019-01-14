import {Injectable} from '@angular/core';
import {map} from "rxjs/operators";
import {InvTargetEntry} from "./inv-target-entry";
import {HttpClient} from "@angular/common/http";
import {InvEntry} from "./inv-entry";
import {CompareEntry} from "./compare-entry";
import {TargetEntriesCacheService} from "./target-entries-cache.service";

export const API_ROOT: string = '/api/inv/';

@Injectable({
    providedIn: 'root'
})
export class InvService {

    constructor(
        readonly http: HttpClient,
        readonly cachedTargetEntries: TargetEntriesCacheService
    ) {
    }

    async getTargetEntries(): Promise<InvTargetEntry[]> {
        return await this.cachedTargetEntries.getValue();
    }

    async getEntries(stockId: number): Promise<InvEntry[]> {
        return this.http.post(API_ROOT + 'entry/list', {
            filter: [
                {
                    field: "stock_id",
                    value: stockId
                }
            ]
        }).pipe(map((response: { data: InvEntry[] }) => {
                return response.data
                    .map((entry: InvEntry) => {
                        entry.expiration_date = new Date(entry.expiration_date);
                        entry.created_on = new Date(entry.created_on);
                        return entry;
                    })
            })
        ).toPromise();
    }

    async deleteEntry(id: number): Promise<void> {
        await this.http.delete(API_ROOT + 'entry/delete/' + id).toPromise();
    }

    async getComparison(): Promise<CompareEntry[]> {
        return ((await this.http.get(API_ROOT + 'comparison').toPromise()) as any).comparison;
    }

    async getAutoFill(name: string): Promise<InvEntry> {
        return ((await this.http.post(API_ROOT + 'autoFill', {
            name: name
        }).toPromise()) as any).data
    }

    async createEntry(entry: InvEntry): Promise<number> {
        return ((await this.http.post(API_ROOT + 'entry/create', entry)) as any).id;
    }

    async getNextId(): Promise<number> {
        return ((await this.http.get(API_ROOT + 'nextId').toPromise()) as any).nextId
    }
}
