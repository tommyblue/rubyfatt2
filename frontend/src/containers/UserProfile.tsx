import { observer } from "mobx-react"
import * as React from "react";

import { RootStore, withStore } from "../store/store";
import CustomersList from "../components/Customers/List";
import Page from "../components/Page";
import ProfileForm from "../components/User/ProfileForm";

interface IProps {
    store: RootStore;
}

class UserProfile extends React.Component<IProps, {}> {

    public componentDidMount() {
        this.props.store.domainStore.loadUser();
        this.props.store.domainStore.loadCustomers();
    }

    public render() {
        return (
            <Page sidebarContent={
                <CustomersList customers={this.props.store.domainStore.customersList} />
            }>
                <ProfileForm userProfile={this.props.store.domainStore.user}/>
            </Page>
        );
    }
}

export default withStore(observer(UserProfile));
