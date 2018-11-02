export interface IInvoice {
    id?: number;
    date: string;
    number: number;
    payment_date: string;
    downloaded: boolean;
}

export default class Invoice {
    public id: number;
    public date: string;
    public number: number;
    public payment_date: string;
    public downloaded: boolean;

    constructor(i: IInvoice) {
        this.id = i.id;
        this.date = i.date;
        this.number = i.number;
        this.payment_date = i.payment_date;
        this.downloaded = i.downloaded;
    }
}
