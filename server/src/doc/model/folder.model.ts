import {CRUDModel} from '../../core/crud/crud.model';

export class FolderModel implements CRUDModel {
    id: number = 0;
    name: string = '';
    location: string = '';
    created_on: Date = new Date();
}
