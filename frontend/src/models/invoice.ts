import { map } from "lodash";

import Slip, { ISlip } from "./slip";

export interface IInvoice {
    id?: number;
    customer_id: number;
    date: string;
    number: number;
    payment_date: string;
    downloaded: boolean;
    rate: string;
    total: string;
    slips: ISlip[];
    consolidated_tax_id: number;
}

export default class Invoice {
    public id: number;
    public customer_id: number;
    public date: string;
    public number: number;
    public payment_date: string;
    public downloaded: boolean;
    public rate: number;
    public total: number;
    public slips: Slip[];
    public consolidated_tax_id: number;

    constructor(i: IInvoice) {
        this.id = i.id;
        this.customer_id = i.customer_id;
        this.date = i.date;
        this.number = i.number;
        this.payment_date = i.payment_date;
        this.downloaded = i.downloaded;
        this.consolidated_tax_id = i.consolidated_tax_id;
        this.rate = parseFloat(i.rate);
        this.total = parseFloat(i.total);
        this.slips = this.parseSlips(i.slips);
    }

    private parseSlips(islips: ISlip[]): Slip[] {
        return map(islips, islip => new Slip(islip));
    }
}
