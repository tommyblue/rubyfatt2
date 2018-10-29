import { isEmpty } from "lodash";
import { observable } from "mobx";

import { RootStore } from "./store";

export interface ICustomer {
    id: number;
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

export class DomainStore {
    rootStore: RootStore = null;

    @observable customers: ICustomer[] = [];

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
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
                        this.customers = jsonResp.data;
                    }
                );
            }
        );
    }
}
