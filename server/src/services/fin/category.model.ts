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



