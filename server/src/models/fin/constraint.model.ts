import {ICRUDModel} from "../../core/crud/crud.model";

export class ConstraintModel implements ICRUDModel {
    id: number = 0;
    name: string = '';
    message: string = '';
    definition: string = '';
    created_on: Date = null;
}