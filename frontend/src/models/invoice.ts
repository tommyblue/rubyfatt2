import { map } from "lodash";

import Slip, { ISlip } from "./slip";

export interface IInvoice {
    id?: number;
    date: string;
    number: number;
    payment_date: string;
    downloaded: boolean;
    rate: string;
    total: string;
    slips: ISlip[];
}

export default class Invoice {
    public id: number;
    public date: string;
    public number: number;
    public payment_date: string;
    public downloaded: boolean;
    public rate: number;
    public total: number;
    public slips: Slip[];

    constructor(i: IInvoice) {
        this.id = i.id;
        this.date = i.date;
        this.number = i.number;
        this.payment_date = i.payment_date;
        this.downloaded = i.downloaded;
        this.rate = parseFloat(i.rate);
        this.total = parseFloat(i.total);
        this.slips = this.parseSlips(i.slips);
    }

    private parseSlips(islips: ISlip[]): Slip[] {
        return map(islips, islip => new Slip(islip));
    }
}
