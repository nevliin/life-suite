export class Singletons {

    private static instances: Map<any, any> = new Map();
    private static boundSingletons: BoundSingleton[] = [];
    private static staticSingletons: any[] = [];

    public static async init() {
        for (const boundSingleton of this.boundSingletons) {
            const creator = new Creator(boundSingleton.singleton);
            const instance: any = creator.getNew();
            await instance.init();
            this.instances.set(boundSingleton.symbol, instance);
            console.debug(`Instantiated Singleton for [${boundSingleton.symbol.toString()}]`);
        }

        for (const staticSingleton of this.staticSingletons) {
            await staticSingleton.init();
            console.debug(`Initiated static singleton`);
        }
    }

    public static get(type: any) {
        return this.instances.get(type);
    }

    public static bind(singleton: any) {
        const boundSingleton: BoundSingleton = new BoundSingleton(singleton);
        this.boundSingletons.push(boundSingleton);
        return boundSingleton;
    }

    public static bindStatic(singleton: any) {
        this.staticSingletons.push(singleton);
    }

}

export interface Singleton {
    init(): Promise<void>;
}

export class BoundSingleton {

    symbol: any;
    singleton: any;

    constructor(singleton: any) {
        this.singleton = singleton;
    }

    public to(symbol: any) {
        this.symbol = symbol;
    }

}

interface ParameterlessConstructor<T> {
    new(): T;
}

class Creator<T> {
    constructor(private ctor: ParameterlessConstructor<T>) {

    }

    getNew() {
        return new this.ctor();
    }
}