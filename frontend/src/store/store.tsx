import * as React from "react";

import { AuthStore } from "./auth";

export class RootStore {
    authStore: AuthStore = null;

    constructor() {
        this.authStore = new AuthStore(this);
    }
}

export const { Provider, Consumer } = React.createContext(new RootStore());

export const withStore = (WrappedComponent: any): any => {
    return class extends React.Component {
        render() {
            return (
                <Consumer>
                    {store => (
                        <WrappedComponent store={store} {...this.props} />
                    )}
                </Consumer>
            );
        }
    }
};
