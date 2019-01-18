import {Injectable} from '@angular/core';
import {CachedObject} from '../core/cached-object';
import {InvTargetEntry} from './inv-target-entry';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

export const API_ROOT: string = '/api/inv/';

@Injectable({
    providedIn: 'root'
})
export class TargetEntriesCacheService extends CachedObject<InvTargetEntry[]> {

    constructor(
        private readonly http: HttpClient
    ) {
        super();
    }

    async loadValue(): Promise<InvTargetEntry[]> {
        return await this.http.get(API_ROOT + 'targetEntry/list')
            .pipe(map((response: { data: InvTargetEntry[] }) => response.data)
            ).toPromise();
    }
}
