import {CRUDModel} from "../../core/crud/crud.model";

export class CategoryModel implements CRUDModel {
    id: number = 0;
    name: string = '';
    active: boolean = false;
}