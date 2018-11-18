import {Injectable} from '@angular/core';
import {map} from "rxjs/operators";
import {InvTargetEntry} from "./inv-target-entry";
import {HttpClient} from "@angular/common/http";
import {InvEntry} from "./inv-entry";
import {CompareEntry} from "./compare-entry";

const API_ROOT: string = '/api/inv/';

@Injectable({
    providedIn: 'root'
})
export class InvService {

    constructor(
        readonly http: HttpClient
    ) {
    }

    async getTargetEntries(): Promise<InvTargetEntry[]> {
        return await this.http.get(API_ROOT + 'targetEntry/list')
            .pipe(map((response: { data: InvTargetEntry[] }) => response.data)
            ).toPromise();
    }

    async getEntries(): Promise<InvEntry[]> {
        return this.http.get(API_ROOT + 'entry/list')
            .pipe(map((response: { data: InvEntry[] }) => {
                    return response.data
                        .map((entry: InvEntry) => {
                            entry.expirationDate = new Date(entry.expirationDate);
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
