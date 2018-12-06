import {ICRUDModel} from "../../core/crud/crud.model";

export class TargetEntryModel implements ICRUDModel {
    id: number = null;
    name: string = null;
    amount: string = null;
}