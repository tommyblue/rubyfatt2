import * as React from "react";

import { AuthStore } from "./auth";
import { MessagesStore } from "./messages";

export class RootStore {
    authStore: AuthStore = null;
    messagesStore: MessagesStore = null;

    constructor() {
        this.authStore = new AuthStore(this);
        this.messagesStore = new MessagesStore(this);
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
