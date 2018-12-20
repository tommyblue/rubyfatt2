import { isEmpty, map, sortBy } from "lodash";
import { computed, observable } from "mobx";

import { getErrMsg } from "../utils";
import { RootStore } from "./store";
import ConsolidatedTax, { IConsolidatedTax } from "../models/consolidated_tax";
import Customer, { ICustomer } from "../models/customer";
import Invoice, { IInvoice } from "../models/invoice";
import InvoiceProject, { IInvoiceProject } from "../models/invoice_project";
import Slip, { ISlip, ISlipForm } from "../models/slip";
import User, { IUser, IUserForm } from "../models/user";

export class DomainStore {
    rootStore: RootStore = null;

    @observable user: User = null;
    @observable customers: Customer[] = [];
    @observable slips: {[id: number]: Slip[]} = {};
    @observable invoice_projects: {[id: number]: InvoiceProject[]} = {};
    @observable invoices: {[id: number]: Invoice[]} = {};
    @observable consolidated_taxes: ConsolidatedTax[] = [];

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    /*
     * User
     */
    public loadUser(force: boolean = false): void {
        if (!isEmpty(this.user) && !force) {
            return
        }

        this.rootStore.authStore.authFetch("/api/v1/user").then(
            (response: Response) => {
                if (!response.ok) {
                    return console.warn(response.statusText);
                }
                return response.json().then(
                    (jsonResp: {data: IUser}) => {
                        this.user = new User(jsonResp.data);
                    }
                );
            }
        );
    }

    public updateProfile(profile: IUserForm): Promise<any> {
        return this.rootStore.authStore.authFetch(`/api/v1/user`, "POST", {profile}).then(
            (response: Response) => {
                if (!response.ok) {
                    return response.json().then(resp => {
                        throw(getErrMsg(resp.errors));
                    }).catch(err => {
                        throw(getErrMsg(err));
                    });
                };
                return response.json().then(
                    (jsonResp: {data: IUser}) => {
                        this.user = new User(jsonResp.data);
                    }
                );
            }
        );
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

    public createSlip(customer: Customer, slip: ISlipForm): Promise<any> {
        return this.rootStore.authStore.authFetch(`/api/v1/customers/${customer.id}/slips`, "POST", {slip}).then(
            (response: Response) => {
                if (!response.ok) {
                    return response.json().then(resp => {
                        throw(getErrMsg(resp.errors));
                    }).catch(err => {
                        throw(getErrMsg(err));
                    });
                };
                return response.json().then(
                    (jsonResp: {data: ISlip}) => {
                        const slip_obj = new Slip(jsonResp.data);
                        if (this.slips[slip_obj.customer_id] === undefined) {
                            this.slips[slip_obj.customer_id] = [];
                        }
                        this.slips[slip_obj.customer_id].push(slip_obj);
                    }
                );
            }
        );
    }

    public editSlip(customerId: number, slipId: number, slip: ISlipForm): Promise<any> {
        return this.rootStore.authStore.authFetch(`/api/v1/customers/${customerId}/slips/${slipId}`, "PUT", {slip}).then(
            (response: Response) => {
                if (!response.ok) {
                    return response.json().then(resp => {
                        throw(getErrMsg(resp.errors));
                    }).catch(err => {
                        throw(getErrMsg(err));
                    });
                };
                return response.json().then(
                    (jsonResp: {data: ISlip}) => {
                        const slip_obj = new Slip(jsonResp.data);
                        if (this.slips[slip_obj.customer_id] === undefined) {
                            this.slips[slip_obj.customer_id] = [];
                        }
                        // Remove the slip from the current list
                        let replaced = false;
                        this.slips[slip_obj.customer_id].forEach((slip, index) => {
                            if (slip.id === slip_obj.id) {
                                this.slips[slip_obj.customer_id][index] = slip_obj;
                                replaced = true;
                            }
                        })
                        if (!replaced) {
                            console.warn("wasn't replaced!")
                            this.slips[slip_obj.customer_id].push(slip_obj);
                        }
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

    public deleteSlip(slipId: number, customerId: number) {
        return this.rootStore.authStore.authFetch(`/api/v1/customers/${customerId}/slips/${slipId}`, "DELETE").then(
            (response: Response) => {
                if (!response.ok) {
                    return response.json().then(resp => {
                        throw(getErrMsg(resp.errors));
                    }).catch(err => {
                        throw(getErrMsg(err));
                    });
                };
                this.loadSlips(customerId, true);
            }
        );
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
            return sortBy(this.invoice_projects[customerId], "date");
        }
        return [];
    }

    public createInvoiceProject(invoice_project: IInvoiceProject): Promise<any> {
        return this.rootStore.authStore.authFetch("/api/v1/invoice_projects", "POST", {invoice_project}).then(
            (response: Response) => {
                if (!response.ok) {
                    return response.json().then(resp => {throw(resp.errors)});
                }
                return response.json().then(
                    (jsonResp: {data: IInvoiceProject}) => {
                        const invoice_project_obj = new InvoiceProject(jsonResp.data);
                        if (this.invoice_projects[invoice_project_obj.customer_id] === undefined) {
                            this.invoice_projects[invoice_project_obj.customer_id] = [];
                        }
                        this.invoice_projects[invoice_project_obj.customer_id].push(invoice_project_obj);
                    }
                );
            }
        )
    }

    public deleteInvoiceProject(invoiceProjectId: number, customerId: number) {
        return this.rootStore.authStore.authFetch(`/api/v1/customers/${customerId}/invoice_projects/${invoiceProjectId}`, "DELETE").then(
            (response: Response) => {
                if (!response.ok) {
                    return response.json().then(resp => {
                        throw(getErrMsg(resp.errors));
                    }).catch(err => {
                        throw(getErrMsg(err));
                    });
                };
                this.loadInvoiceProjects(customerId, true);
            }
        );
    }

    public printInvoiceProject(invoiceProjectId: number, customerId: number) {
        return this.rootStore.authStore.authFetch(`/api/v1/customers/${customerId}/invoice_projects/${invoiceProjectId}/print`, "GET").then(
            (response: Response) => {
                if (!response.ok) {
                    return console.warn(response.statusText);
                }
                return response.json().then(
                    (jsonResp: any) => {
                        return jsonResp.data.url;
                    }
                );
            }
        );
    }

    /*
     * Invoices
     */
    public loadInvoices(customerId: number, force: boolean = false): void {
        if (this.invoices[customerId] !== undefined && !force) {
            return;
        }
        this.rootStore.authStore.authFetch(`/api/v1/customers/${customerId}/invoices`).then(
            (response: Response) => {
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
            return sortBy(this.invoices[customerId], "date");
        }
        return [];
    }

    public deleteInvoice(invoiceId: number, customerId: number) {
        return this.rootStore.authStore.authFetch(`/api/v1/customers/${customerId}/invoices/${invoiceId}`, "DELETE").then(
            (response: Response) => {
                if (!response.ok) {
                    return response.json().then(resp => {
                        throw(getErrMsg(resp.errors));
                    }).catch(err => {
                        throw(getErrMsg(err));
                    });
                };
                this.loadInvoices(customerId, true);
            }
        );
    }

    public printInvoice(invoiceId: number, customerId: number) {
        return this.rootStore.authStore.authFetch(`/api/v1/customers/${customerId}/invoices/${invoiceId}/print`, "GET").then(
            (response: Response) => {
                if (!response.ok) {
                    return console.warn(response.statusText);
                }
                return response.json().then(
                    (jsonResp: any) => {
                        return jsonResp.data.url;
                    }
                );
            }
        );
    }

    public createInvoice(invoice: IInvoice): Promise<any> {
        return this.rootStore.authStore.authFetch("/api/v1/invoices", "POST", {invoice}).then(
            (response: Response) => {
                if (!response.ok) {
                    return response.json().then(resp => {throw(resp.errors)});
                }
                return response.json().then(
                    (jsonResp: {data: IInvoice}) => {
                        const invoice_obj = new Invoice(jsonResp.data);
                        if (this.invoices[invoice_obj.customer_id] === undefined) {
                            this.invoices[invoice_obj.customer_id] = [];
                        }
                        this.invoices[invoice_obj.customer_id].push(invoice_obj);
                    }
                );
            }
        )
    }

    /*
     * Consolidated taxes
     */
    public loadConsolidatedTaxes(force: boolean = false): void {
        if (this.consolidated_taxes.length > 0 && !force) {
            return;
        }
        this.rootStore.authStore.authFetch(`/api/v1/consolidated_taxes`).then(
            (response: any) => {
                if (!response.ok) {
                    return console.warn(response.statusText);
                }
                return response.json().then(
                    (jsonResp: {data: IConsolidatedTax[]}) => {
                        this.consolidated_taxes = map(jsonResp.data, (ct: IConsolidatedTax) =>
                            new ConsolidatedTax(ct));
                    }
                );
            }
        );
    }
}
