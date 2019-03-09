export class DocumentModel {
    id: number = 0;
    title: string = '';
    description: string = '';
    pages: number = 0;
    received_on: Date = new Date();
    created_on: Date = new Date();
    file_name: string = '';
    folder: number = 0;
}
