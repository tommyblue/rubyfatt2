import { observer } from "mobx-react"
import * as React from "react";

import { RootStore, withStore } from "../store/store";
import CustomersList from "../components/Customers/CustomersList";
import Page from "../components/Page";

interface IProps {
    store: RootStore;
}

class Dasboard extends React.Component<IProps, {}> {

    public componentDidMount() {
        this.props.store.domainStore.loadCustomers();
    }

    public render() {
        return (
            <Page sidebarContent={
                <CustomersList customers={this.props.store.domainStore.customers} />
            }>
                <div>
                    Dashboard
                </div>
            </Page>
        );
    }
}

export default withStore(observer(Dasboard));
