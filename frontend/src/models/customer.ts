export interface ICustomer {
    id?: number;
    title: string;
    name: string;
    surname: string;
    address: string;
    zip_code: string;
    town: string;
    province: string;
    country: string;
    tax_code: string;
    vat: string;
    info: string;
}

export default class Customer {
    public id: number;
    public title: string;
    public name: string;
    public surname: string;
    public address: string;
    public zip_code: string;
    public town: string;
    public province: string;
    public country: string;
    public tax_code: string;
    public vat: string;
    public info: string;

    constructor(c: ICustomer) {
        this.id = c.id;
        this.title = c.title;
        this.name = c.name;
        this.surname = c.surname;
        this.address = c.address;
        this.zip_code = c.zip_code;
        this.town = c.town;
        this.province = c.province;
        this.country = c.country;
        this.tax_code = c.tax_code;
        this.vat = c.vat;
        this.info = c.info;
    }

    public get fullName(): string {
        return `${this.name || ""} ${this.surname || ""}`;
    }

    public get fullAddress(): string {
        return `${this.address || ""} ${this.zip_code || ""} ${this.town || ""}
                ${this.province || ""} ${this.country || ""}`;
    }
}
