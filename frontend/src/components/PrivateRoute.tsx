import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { observer } from "mobx-react"

import { RootStore, withStore } from "../store/store";

interface IProps {
    store: RootStore;
    location: any;
    component: any;
    path: string;
}

class WrappedRoute extends React.Component<IProps, {}> {
    render() {
        if (!this.props.store.authStore.authToken) {
            return (
                <Redirect
                    to={{
                    pathname: "/login",
                    state: { from: this.props.location }
                    }}
                />
            );
        }

        return (
            <Route {...this.props} />
        );
    }
}

export const PrivateRoute = withStore(observer(WrappedRoute));
