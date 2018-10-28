import { includes, cloneDeep } from "lodash";
import { observer } from "mobx-react"
import { Redirect } from "react-router-dom";
import * as _ from "lodash";
import * as React from "react";

import { withStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";

import { Form } from "../components/Login/Form";
import { RootStore, withStore } from "../store/store";

interface IProps {
    store: RootStore;
    location: string;
    classes: any;
}

export interface IState {
    email: string;
    password: string;
}

const styles = (theme: any) => ({
    container: {
        minWidth: 600,
        minHeight: 400,
    },
    button: {
        margin: 2 * theme.spacing.unit,
    },
    inputGroup: {
        margin: 2 * theme.spacing.unit,
    }
});

class Login extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = { email: "", password: "" };
        this.authenticate = this.authenticate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    public render(): JSX.Element {
        if (this.props.store.authStore.isAuthenticated) {
            return (
                <Redirect
                    to={{
                    pathname: "/",
                    state: { from: this.props.location }
                    }}
                />
            );
        }
        const { classes } = this.props;
        return (
            <Grid container spacing={16} style={{flexGrow: 1}}>
                <Grid item xs={12}>
                    <Grid container direction="row" alignItems="center" justify="center" spacing={16} className={classes.container}>
                        <Grid item xs={3}>
                            <Form classes={classes} state={this.state} onChange={this.handleChange} onSubmit={this.authenticate} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }

    private handleChange(key: string, value: string|number): void {
        const newState: IState = cloneDeep(this.state);
        if (!includes(['email', 'password'], key)) {
            console.warn("Trying to set an unknown field:", key);
            return
        }
        (newState as any)[key] = value;
        this.setState(newState);
    }

    private authenticate(): void {
        this.props.store.authStore.authenticate(this.state.email, this.state.password);
    }
}


export default withStyles(styles)(withStore(observer(Login)));
