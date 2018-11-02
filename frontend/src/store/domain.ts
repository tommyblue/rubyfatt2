import { isEmpty, map, sortBy } from "lodash";
import { computed, observable } from "mobx";

import { RootStore } from "./store";
import Customer, { ICustomer } from "../models/customer";
import Slip, { ISlip } from "../models/slip";
import InvoiceProject, { IInvoiceProject } from "../models/invoice_project";
import Invoice, { IInvoice } from "../models/invoice";

export class DomainStore {
    rootStore: RootStore = null;

    @observable customers: Customer[] = [];
    @observable slips: {[id: number]: Slip[]} = {};
    @observable invoice_projects: {[id: number]: InvoiceProject[]} = {};
    @observable invoices: {[id: number]: Invoice[]} = {};

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    /*
     * Customers
     */

    @computed get customersList(): Customer[] {
        return sortBy(this.customers, "title");
    }

    public createCustomer(customer: ICustomer): Promise<any> {
        return this.rootStore.authStore.authFetch("/api/v1/customers", "POST", {customer}).then(
            (response: Response) => {
                if (!response.ok) {
                    return response.json().then(resp => {throw(resp.errors)});
                }
                return response.json().then(
                    (jsonResp: {data: ICustomer}) => {
                        this.customers.push(new Customer(jsonResp.data));
                    }
                );
            }
        )
    }

    public loadCustomers(force: boolean = false): void {
        if (!isEmpty(this.customers) && !force) {
            return
        }

        this.rootStore.authStore.authFetch("/api/v1/customers").then(
            (response: Response) => {
                if (!response.ok) {
                    return console.warn(response.statusText);
                }
                return response.json().then(
                    (jsonResp: {data: ICustomer[]}) => {
                        this.customers = map(jsonResp.data, (c: ICustomer) => new Customer(c));
                    }
                );
            }
        );
    }

    /*
     * Slips
     */

    public loadSlips(customerId: number, force: boolean = false): void {
        if (this.slips[customerId] !== undefined && !force) {
            return;
        }
        this.rootStore.authStore.authFetch(`/api/v1/customers/${customerId}/slips?running=true`).then(
            (response: any) => {
                if (!response.ok) {
                    return console.warn(response.statusText);
                }
                return response.json().then(
                    (jsonResp: {data: ISlip[]}) => {
                        this.slips[customerId] = map(jsonResp.data, (s: ISlip) => new Slip(s));
                    }
                );
            }
        );
    }

    public getCustomerSlips(customerId: number): Slip[] {
        if (this.slips[customerId] !== undefined) {
            return this.slips[customerId];
        }
        return [];
    }

    /*
     * Invoice Projects
     */

    public loadInvoiceProjects(customerId: number, force: boolean = false): void {
        if (this.invoice_projects[customerId] !== undefined && !force) {
            return;
        }
        this.rootStore.authStore.authFetch(`/api/v1/customers/${customerId}/invoice_projects`).then(
            (response: any) => {
                if (!response.ok) {
                    return console.warn(response.statusText);
                }
                return response.json().then(
                    (jsonResp: {data: IInvoiceProject[]}) => {
                        this.invoice_projects[customerId] = map(jsonResp.data, (ip: IInvoiceProject) =>
                            new InvoiceProject(ip));
                    }
                );
            }
        );
    }

    public getCustomerInvoiceProjects(customerId: number): InvoiceProject[] {
        if (this.invoice_projects[customerId] !== undefined) {
            return this.invoice_projects[customerId];
        }
        return [];
    }

    /*
     * Invoices
     */
    public loadInvoices(customerId: number, force: boolean = false): void {
        if (this.invoices[customerId] !== undefined && !force) {
            return;
        }
        this.rootStore.authStore.authFetch(`/api/v1/customers/${customerId}/invoices`).then(
            (response: any) => {
                if (!response.ok) {
                    return console.warn(response.statusText);
                }
                return response.json().then(
                    (jsonResp: {data: IInvoice[]}) => {
                        this.invoices[customerId] = map(jsonResp.data, (ip: IInvoice) =>
                            new Invoice(ip));
                    }
                );
            }
        );
    }

    public getCustomerInvoices(customerId: number): Invoice[] {
        if (this.invoices[customerId] !== undefined) {
            return this.invoices[customerId];
        }
        return [];
    }
}
