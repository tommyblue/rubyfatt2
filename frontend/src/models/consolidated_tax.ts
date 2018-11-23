export interface IConsolidatedTax {
    id?: number;
    name: string;
    notes: string;
}

export default class ConsolidatedTax {
    public id: number;
    public name: string;
    public notes: string;

    constructor(rawConsolidatedTax: IConsolidatedTax) {
        this.id = rawConsolidatedTax.id;
        this.name = rawConsolidatedTax.name;
        this.notes = rawConsolidatedTax.notes;
    }
}
