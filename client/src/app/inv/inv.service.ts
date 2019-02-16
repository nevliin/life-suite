import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {InvTargetEntry} from './inv-target-entry';
import {HttpClient} from '@angular/common/http';
import {InvEntry} from './inv-entry';
import {CompareEntry} from './compare-entry';
import {InvStock} from './inv-stock';
import {BehaviorSubject} from 'rxjs';
import {ErrorHandlingService} from '../core/error-handling/error-handling.service';

export const LOCAL_STORAGE_STOCK_TOKEN = 'life-suite-inv-stock';
export const API_ROOT: string = '/api/inv/';

@Injectable({
    providedIn: 'root'
})
export class InvService {

    public get stockId() {
        return this.currentStockId$.getValue();
    }

    public currentStockId$: BehaviorSubject<number | null> = new BehaviorSubject(null);

    constructor(
        readonly http: HttpClient,
        private readonly errorHandlingService: ErrorHandlingService
    ) {
    }

    async getTargetEntries(stockId: number): Promise<InvTargetEntry[]> {
        return await this.http
            .get(API_ROOT + 'targetEntry/list', {
                params: {
                    options: btoa(JSON.stringify({
                        filter: [
                            {
                                field: 'stock_id',
                                value: stockId,
                                partialMatch: false
                            }
                        ]
                    }))
                }
            })
            .pipe(map((response: { data: InvTargetEntry[] }) => response.data))
            .toPromise().catch(e => {
                this.errorHandlingService.handleHTTPError(e);
                return [];
            });
    }

    async getEntries(stockId: number): Promise<InvEntry[]> {
        return this.http.post(API_ROOT + 'entry/list', {
            filter: [
                {
                    field: 'stock_id',
                    value: stockId
                }
            ]
        }).pipe(map((response: { data: InvEntry[] }) => {
                return response.data
                    .map((entry: InvEntry) => {
                        entry.expiration_date = new Date(entry.expiration_date);
                        entry.created_on = new Date(entry.created_on);
                        return entry;
                    });
            })
        ).toPromise();
    }

    async searchEntries(stockId: number, filter: any[]): Promise<InvEntry[]> {
        if (filter) {
            filter.push({
                field: 'stock_id',
                value: stockId,
                partialMatch: false
            });
        } else {
            filter = [{
                field: 'stock_id',
                value: stockId,
                partialMatch: false
            }];
        }
        return this.http.post(API_ROOT + 'entry/list', {
            filter: filter
        }).pipe(map((response: { data: InvEntry[] }) => {
                return response.data
                    .map((entry: InvEntry) => {
                        entry.expiration_date = new Date(entry.expiration_date);
                        entry.created_on = new Date(entry.created_on);
                        return entry;
                    });
            })
        ).toPromise();
    }


    async deleteEntry(id: number): Promise<void> {
        await this.http.delete(API_ROOT + 'entry/delete/' + id).toPromise();
    }

    async getComparison(stockId: number): Promise<CompareEntry[]> {
        return ((await this.http.get(API_ROOT + 'comparison', {
            params: {
                stockId: stockId.toString()
            }
        }).toPromise()) as any).comparison;
    }

    async getAutoFill(name: string): Promise<InvEntry> {
        return ((await this.http.post(API_ROOT + 'autoFill', {
            name: name
        }).toPromise()) as any).data;
    }

    async createEntries(entry: InvEntry, amount: number): Promise<number[]> {
        return ((await this.http.post(API_ROOT + 'createMultipleEntries', {
            entry: entry,
            amount: amount
        }).toPromise()) as any).data;
    }

    async updateEntry(entry: InvEntry): Promise<number> {
        return ((await this.http.put(API_ROOT + 'entry/update', {
            data: entry
        }).toPromise().catch(e => {
            this.errorHandlingService.handleHTTPError(e);
            return {};
        })) as any);
    }

    async createTargetEntry(entry: InvTargetEntry): Promise<number> {
        return ((await this.http.post(API_ROOT + 'targetEntry/create', entry).toPromise()) as any);
    }

    async updateTargetEntry(entry: InvTargetEntry): Promise<number> {
        return ((await this.http.put(API_ROOT + 'targetEntry/update', {
            data: entry
        }).toPromise().catch(e => {
            this.errorHandlingService.handleHTTPError(e);
            return {};
        })) as any);
    }

    async deleteTargetEntry(id: number): Promise<void> {
        await this.http.delete(API_ROOT + 'targetEntry/delete/' + id).toPromise();
    }

    async getNextId(): Promise<number> {
        return ((await this.http.get(API_ROOT + 'nextId').toPromise()) as any).nextId;
    }

    async getStocks(): Promise<InvStock[]> {
        return ((await this.http.get(API_ROOT + 'stock/list', {}).toPromise()) as any).data;
    }
}
