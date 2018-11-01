import { filter } from "lodash";
import { match } from "react-router";
import { observer } from "mobx-react"
import * as React from "react";

import CustomerModel from "../models/customer";
import { RootStore, withStore } from "../store/store";
import Customer from "../components/Customers/Customer";
import CustomersList from "../components/Customers/CustomersList";
import Page from "../components/Page";

interface IProps {
    store: RootStore;
    classes: any;
    match: match;
}

class WrappedCustomers extends React.Component<IProps, {}> {

    constructor(props: IProps) {
        super(props);
        this.showCustomer = this.showCustomer.bind(this);
    }

    public componentDidMount() {
        this.props.store.domainStore.loadCustomers();
    }

    public render(): JSX.Element {
        return (
            <Page sidebarContent={
                <CustomersList customers={this.props.store.domainStore.customersList} />
            }>
                <div>
                    {this.showCustomer()}
                </div>
            </Page>
        );
    }

    private showCustomer(): JSX.Element {
        const params = this.props.match.params as any;
        if (!params.id) {
            return <span />;
        }

        const customers = filter(this.props.store.domainStore.customers,
            (customer: CustomerModel) => customer.id === parseInt(params.id)
        );
        if (customers.length !== 1) {
            return <span />;
        }

        return <Customer customer={customers[0]} />
    }
}

export default withStore(observer(WrappedCustomers));
