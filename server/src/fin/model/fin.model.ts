export class CategoryModel {
    name: string;
    active: boolean;
}

export class CategoryAddModel extends CategoryModel {

}

export class CategoryUpdateModel extends CategoryModel {
    id: number;
}

export class CategoryDeleteModel {
    id: number;
}

export class AccountTransactionsRequest {
    accountId: string;
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



