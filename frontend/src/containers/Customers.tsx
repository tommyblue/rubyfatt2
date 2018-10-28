import { map } from "lodash";
import * as React from "react";
import { observer } from "mobx-react"

import { RootStore, withStore } from "../store/store";

interface IProps {
    store: RootStore;
}

class WrappedCustomers extends React.Component<IProps, {}> {
    public componentDidMount() {
        this.props.store.domainStore.loadCustomers();
    }

    public render(): JSX.Element {
        return (
            <ul>
                {map(this.props.store.domainStore.customers, (customer) => (
                    <li key={customer.id}>{customer.title}</li>
                ))}
            </ul>
        );
    }
}

export default withStore(observer(WrappedCustomers))
