export interface IInvoiceProject {
    id?: number;
    date: string;
    number: number;
    invoiced: boolean;
    downloaded: boolean;
}

export default class InvoiceProject {
    public id: number;
    public date: string;
    public number: number;
    public invoiced: boolean;
    public downloaded: boolean;

    constructor(ip: IInvoiceProject) {
        this.id = ip.id;
        this.date = ip.date;
        this.number = ip.number;
        this.invoiced = ip.invoiced;
        this.downloaded = ip.downloaded;
    }
}
