import * as React from "react";
import { observable } from "mobx";

export interface IStore {
    authToken: string;
    authenticate: () => void;
}

export class RootStore {
    @observable authToken: string | null = null;

    constructor(params?: IStore) {
        if (params && params.authToken) {
            this.authToken = params.authToken;
        }
    }

    public authenticate(): void {
        console.log("auth!")
        this.authToken = "pippo";
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
