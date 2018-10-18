import {ICRUDModel} from "../../core/crud.model";

export class TargetEntryModel implements ICRUDModel {
    id: number = null;
    name: string = null;
    amount: string = null;
}