import * as _ from "lodash";
import * as React from "react";
import { Redirect } from 'react-router-dom';
import { observer } from "mobx-react"

import { IStore, withStore } from "../store";

interface IProps {
    store: IStore;
    location: string;
}

class Login extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
        this.authenticate = this.authenticate.bind(this);
    }

    public render(): JSX.Element {
        if (this.props.store.authToken) {
            return (
                <Redirect
                    to={{
                    pathname: "/",
                    state: { from: this.props.location }
                    }}
                />
            );
        }
        return (
            <div>
                Token => {this.props.store.authToken}
                <button onClick={this.authenticate}>Authz!</button>
            </div>
        );
    }

    private authenticate(): void {
        this.props.store.authenticate()
    }
}


export default withStore(observer(Login));
