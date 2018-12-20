
export interface IUserForm {
    title: string;
    name: string;
    surname: string;
    address: string;
    town: string;
    province: string;
    zip_code: string;
    tax_code: string;
    vat: string;
    phone: string;
    bank_coordinates: string;
}

export interface IUser {
    title: string;
    name: string;
    surname: string;
    address: string;
    town: string;
    province: string;
    zip_code: string;
    tax_code: string;
    vat: string;
    phone: string;
    bank_coordinates: string;
    language: string;
}

export default class User {
    public title: string;
    public name: string;
    public surname: string;
    public address: string;
    public town: string;
    public province: string;
    public zip_code: string;
    public tax_code: string;
    public vat: string;
    public phone: string;
    public bank_coordinates: string;
    public language: string;

    constructor(u: IUser) {
        this.title = u.title;
        this.name = u.name;
        this.surname = u.surname;
        this.address = u.address;
        this.town = u.town;
        this.province = u.province;
        this.zip_code = u.zip_code;
        this.tax_code = u.tax_code;
        this.vat = u.vat;
        this.phone = u.phone;
        this.bank_coordinates = u.bank_coordinates;
        this.language = u.language;
    }
}
