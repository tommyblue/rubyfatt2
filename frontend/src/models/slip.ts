export interface ISlip {
    id?: number;
    name: string;
    rate: number;
    timed: boolean;
    duration: number;
    customer_id: number;
    invoice_id: number;
    invoice_project_id: number;
}

export default class Slip {
    public id: number;
    public name: string;
    public rate: number;
    public timed: boolean;
    public duration: number;
    public customer_id: number;
    public invoice_id: number;
    public invoice_project_id: number;

    constructor(s: ISlip) {
        this.id = s.id;
        this.name = s.name;
        this.rate = s.rate;
        this.timed = s.timed;
        this.duration = s.duration;
        this.customer_id = s.customer_id;
        this.invoice_id = s.invoice_id;
        this.invoice_project_id = s.invoice_project_id;
    }
}
