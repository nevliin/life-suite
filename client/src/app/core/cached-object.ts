import {FinAccount} from "../fin/fin-account";
import {map} from "rxjs/operators";


export abstract class CachedObject<T> {

    value: T | undefined = null;
    valuePromise: Promise<void>;

    async getValue(forceReload?: boolean): Promise<T> {
        if (this.value !== undefined && !forceReload) {
            return this.value;
        }
        if (this.value !== undefined && !forceReload) {
            await this.valuePromise;
            return this.value;
        }
        if (this.value === undefined || forceReload) {
            let resolveFunc: Function;
            this.valuePromise = new Promise(resolve => {
                resolveFunc = resolve;
            });
            this.value = await this.loadValue();
            resolveFunc();
        }
        return this.value;
    }

    async abstract loadValue(): Promise<T>;

}
