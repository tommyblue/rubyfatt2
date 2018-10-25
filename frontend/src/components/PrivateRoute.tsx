import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { observer } from "mobx-react"

import { IStore, withStore } from "../store";

interface IProps {
    store: IStore;
    location: any;
    component: any;
    path: string;
}

class WrappedRoute extends React.Component<IProps, {}> {
    render() {
        if (!this.props.store.authToken) {
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
