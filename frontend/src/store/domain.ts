import { isEmpty, map, sortBy } from "lodash";
import { computed, observable } from "mobx";

import { RootStore } from "./store";
import Customer, { ICustomer } from "../models/customer";


export class DomainStore {
    rootStore: RootStore = null;

    @observable customers: Customer[] = [];

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

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
            (response: any) => {
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
}
