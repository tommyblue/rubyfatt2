import { cloneDeep } from "lodash";
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
    userProfile: User | null;
}

interface IState {
    userProfile: IUserForm;
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
        name: "title",
    }, {
        type: TextField,
        name: "name",
    }, {
        type: TextField,
        name: "surname",
    }, {
        type: TextField,
        name: "address",
    }, {
        type: TextField,
        name: "town",
    }, {
        type: TextField,
        name: "province",
    }, {
        type: TextField,
        name: "zip_code",
    }, {
        type: TextField,
        name: "tax_code",
    }, {
        type: TextField,
        name: "vat",
    }, {
        type: TextField,
        name: "phone",
    }, {
        type: TextField,
        name: "bank_coordinates",
        multiline: 5,
    }];
    private requiredFormFields: string[] = ["name", "surname"];

    constructor(props: IProps) {
        super(props);
        this.setValue = this.setValue.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

        this.state = { userProfile: null };
    }

    public render(): JSX.Element {
        return (
            <div className={this.props.classes.root}>
                <Paper className={this.props.classes.root} elevation={1}>
                    <Typography variant="h5" component="h3">Profile</Typography>
                    <Form
                        fields={this.formFields}
                        requiredFields={this.requiredFormFields}
                        onValueChange={this.setValue}
                        values={this.getValues()}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        className={this.props.classes.button}
                        onClick={this.handleUpdate}
                    >
                        Save
                    </Button>
                </Paper>
            </div>
        );
    }

    private handleUpdate(): Promise<any> {
        if (this.state.userProfile === null) {
            return new Promise((resolve, _) => {resolve()}, );
        }
        return this.props.store.domainStore.updateProfile(this.state.userProfile)
            .catch((err: any) =>
                this.props.store.messagesStore.createMessage(prepareErrMessage(err), MessageTypes.ERROR));
    }

    private getValues() {
        if (this.state.userProfile !== null) {
            return this.state.userProfile;
        }
        return this.props.userProfile;
    }

    private setValue(key: string, value: string) {
        let newUserProfile: IUserForm | null = cloneDeep(this.state.userProfile);
        if (this.state.userProfile === null) {
            (newUserProfile as any) = {};
            this.formFields.forEach((field) => (newUserProfile as any)[field.name] = (this.props.userProfile as any)[field.name])
        }
        (newUserProfile as any)[key] = value;
        this.setState({...this.state, userProfile: newUserProfile});
    }
}

export default withStore(withStyles(styles)(observer(ProfileForm)));
