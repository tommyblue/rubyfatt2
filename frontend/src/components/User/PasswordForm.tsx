import { cloneDeep, isEmpty, map } from "lodash";
import { observer } from "mobx-react"
import * as React from "react";

import { withStyles, Theme } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Form, { FormField } from "../Form";
import Paper from '@material-ui/core/Paper';
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';

import { MessageTypes } from "../../store/messages";
import { prepareErrMessage } from "../../utils";
import { RootStore, withStore } from "../../store/store";
import User, { IUserForm } from "../../models/user";


interface IProps {
    store: RootStore;
    classes: any;
}

interface IPassword {
    password: string;
    password_confirmation: string;
}
interface IState {
    passwords: IPassword;
    validations: object;
}

const styles = (theme: Theme) => ({
    root: {
        ...theme.mixins.gutters(),
        flexGrow: 1,
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
    button: {
        margin: theme.spacing.unit,
        marginLeft: 0,
    }
});

class ProfileForm extends React.Component<IProps, IState> {
    private formFields: FormField[] = [{
        type: TextField,
        name: "password",
        extraAttrs: {
            type: "password"
        },
    }, {
        type: TextField,
        name: "password_confirmation",
        extraAttrs: {
            type: "password"
        },
    }];

    private emptyState: IState = {
        validations: {},
        passwords: { password: null, password_confirmation: null },
    };

    private requiredFormFields: string[] = ["password", "password_confirmation"];

    constructor(props: IProps) {
        super(props);
        this.setValue = this.setValue.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

        this.state = this.emptyState;
    }

    public render(): JSX.Element {
        return (
            <div className={this.props.classes.root}>
                <Paper className={this.props.classes.root} elevation={1}>
                    <Typography variant="h5" component="h3">Change password</Typography>
                    <Form
                        fields={this.getFormFields()}
                        requiredFields={this.requiredFormFields}
                        onValueChange={this.setValue}
                        values={this.state.passwords}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        className={this.props.classes.button}
                        onClick={this.handleUpdate}
                        disabled={isEmpty(this.state.passwords.password) || !isEmpty(this.state.validations)}
                    >
                        Save
                    </Button>
                </Paper>
            </div>
        );
    }

    // Merge formFields with error state of those fields
    private getFormFields(): FormField[] {
        const fields = map(this.formFields, (field: FormField) => {
            if ((this.state.validations as any)[field.name]) {
                return {...field, extraAttrs: {...field.extraAttrs, error: (this.state.validations as any)[field.name]}};
            }
            return field;
        });
        return fields;
    }

    private handleUpdate(): Promise<any> {
        if (this.state.passwords === null) {
            return new Promise((resolve, _) => {resolve()}, );
        }
        return this.props.store.domainStore.updatePassword(this.state.passwords.password)
            .then(() => {
                this.props.store.messagesStore.createMessage("Password updated", MessageTypes.SUCCESS);
                this.setState(this.emptyState);
            })
            .catch((err: any) =>
                this.props.store.messagesStore.createMessage(prepareErrMessage(err), MessageTypes.ERROR));
    }

    private setValue(key: string, value: string) {
        let newPasswords: IPassword = cloneDeep(this.state.passwords);
        (newPasswords as any)[key] = value;
        let validations = {};
        if (newPasswords.password !== newPasswords.password_confirmation) {
            (validations as any).password_confirmation = true;
        }
        this.setState({...this.state, passwords: newPasswords, validations});
    }
}

export default withStore(withStyles(styles)(observer(ProfileForm)));
