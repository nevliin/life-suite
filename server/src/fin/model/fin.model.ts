export class CategoryModel {
    name: string;
    active: boolean;
}

export class AccountTransactionsRequest {
    accountId: string;
    children?: boolean;
    from?: string;
    to?: string;
    limit?: string;
}

export class CategoryTotalRequest {
    categoryId: number;
    from?: string;
    to?: string;
}

export class AllTransactionsAmountRequest {
    from?: string;
    to?: string;
}

export class AccountBalanceRequest {
    accountId: string;
    year?: string;
}

export class AccountBalanceByCategoryRequest {
    categoryId: string;
    from?: string;
    to?: string;
}

export class AccountBalanceResponse {
    id: number;
    name: string;
    balance: number;
}

export class YearlyCloseRequest {
    year: number;
}


