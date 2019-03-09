import {CRUDModel} from '../../core/crud/crud.model';

export class TagModel implements CRUDModel {
    id: number = 0;
    name: string = '';
    created_on: Date = new Date();
}
