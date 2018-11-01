import {ICRUDModel} from "../../core/crud/crud.model";

export class CategoryModel implements ICRUDModel {
    id: number = 0;
    name: string = '';
    active: boolean = false;
}