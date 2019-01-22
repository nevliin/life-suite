import {EntryModel} from './entry.model';

export class ComparisonRequest {
    stockId: string;
}

export class CreateMultipleEntriesRequest {
    amount: number;
    entry: EntryModel;
}

