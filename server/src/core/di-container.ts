export class DIContainer {

    static instances: Map<any, any> = new Map();
    private static boundDependencies: BoundInjectable[] = [];
    private static staticDependencies: any[] = [];

    public static async init() {
        for (const boundDependency of this.boundDependencies) {
            const creator = new Creator(boundDependency.dependency);
            const instance: any = creator.getNew();
            await instance.init();
            this.instances.set(boundDependency.symbol, instance);
            console.debug(`Instantiated Dependency for [${boundDependency.symbol.toString()}]`);
        }

        for (const staticDependency of this.staticDependencies) {
            await staticDependency.init();
            console.debug(`Initiated static dependency`);
        }
    }

    public static get(type: any) {
        return this.instances.get(type);
    }

    public static bind(dependency: any) {
        const boundDependency: BoundInjectable = new BoundInjectable(dependency);
        this.boundDependencies.push(boundDependency);
        return boundDependency;
    }

    public static bindStatic(dependency: any) {
        this.staticDependencies.push(dependency);
    }

    public static bindInstance(instance: any) {
        return new BoundInstance(instance);
    }

}

export interface Injectable {
    init(): Promise<void>;
}

export class BoundInstance {

    instance: any;

    constructor(instance: any) {
        this.instance = instance;
    }

    public to(symbol: any) {
        DIContainer.instances.set(symbol, this.instance);
    }
}

export class BoundInjectable {

    symbol: any;
    dependency: any;
    config: any[];

    constructor(dependency: any) {
        this.dependency = dependency;
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
