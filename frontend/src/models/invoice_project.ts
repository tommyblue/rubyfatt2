export interface IInvoiceProject {
    id?: number;
    customer_id: number;
    date: string;
    number: number;
    invoiced: boolean;
    downloaded: boolean;
    rate: string;
    total: string;
}

export default class InvoiceProject {
    public id: number;
    public customer_id: number;
    public date: string;
    public number: number;
    public invoiced: boolean;
    public downloaded: boolean;
    public rate: number;
    public total: number;

    constructor(ip: IInvoiceProject) {
        this.id = ip.id;
        this.customer_id = ip.customer_id;
        this.date = ip.date;
        this.number = ip.number;
        this.invoiced = ip.invoiced;
        this.downloaded = ip.downloaded;
        this.rate = parseFloat(ip.rate);
        this.total = parseFloat(ip.total);
    }
}
