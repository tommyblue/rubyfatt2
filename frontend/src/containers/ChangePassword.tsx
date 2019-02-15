import { observer } from "mobx-react"
import * as React from "react";

import { RootStore, withStore } from "../store/store";
import CustomersList from "../components/Customers/List";
import Page from "../components/Page";
import PasswordForm from "../components/User/PasswordForm";

interface IProps {
    store: RootStore;
}

class ChangePassword extends React.Component<IProps, {}> {

    public componentDidMount() {
        this.props.store.domainStore.loadCustomers();
    }

    public render(): JSX.Element {
        return (
            <Page sidebarContent={
                <CustomersList customers={this.props.store.domainStore.customersList} />
            }>
                <PasswordForm />
            </Page>
        );
    }
}

export default withStore(observer(ChangePassword));
