import {CRUDModel} from "../../core/crud/crud.model";

export class ConstraintModel implements CRUDModel {
    id: number = 0;
    name: string = '';
    message: string = '';
    definition: string = '';
    created_on: Date = null;
}