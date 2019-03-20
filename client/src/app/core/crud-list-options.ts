export interface CRUDListOptions {
    limit?: number;
    orderField?: string;
    orderDirection?: string;
    bypassSoftDelete?: boolean;
    filter?: [CRUDListFilter];
}

export interface CRUDListFilter {
    field: string;
    value: any;
    partialMatch?: boolean;
}
