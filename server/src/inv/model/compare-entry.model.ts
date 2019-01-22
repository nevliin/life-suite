export class CompareEntryModel {
    name: string;
    amount: number;

    constructor(name: string, amount: string) {
        this.name = name;
        this.amount = Number(amount);
    }
}