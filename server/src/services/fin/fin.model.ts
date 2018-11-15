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
    accountId: number;
    from?: Date;
    to?: Date;
    limit?: number;
}

export class CategoryTotalRequest {
    categoryId: number;
    from?: string;
    to?: string;
}



