import { cloneDeep, map, join, capitalize } from "lodash";
import { observer } from "mobx-react"
import * as React from "react";

import { withStyles, Theme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";

import { ISlipForm } from "../../models/slip";
import { MessageTypes } from "../../store/messages";
import { prepareErrMessage } from "../../utils";
import { RootStore, withStore } from "../../store/store";
import CustomerModel from "../../models/customer";
import DialogWrapper from "../DialogWrapper";
import Form, { FormField } from "../Form";

interface IProps {
    store: RootStore;
    classes: any;
    customer: CustomerModel;
}

interface IState {
    slip: ISlipForm;
}

const styles = (theme: Theme) => ({
    button: {
        margin: theme.spacing.unit,
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
});

class NewSlip extends React.Component<IProps, IState> {
    formFields: FormField[] = [{
        type: TextField,
        name: "name",
    }, {
        type: TextField,
        name: "rate",
    }];
    requiredFormFields: string[] = ["name"];
    emptySlip: ISlipForm = {
        name: "",
        rate: 0,
    };

    state: IState = { slip: this.emptySlip};

    constructor(props: IProps) {
        super(props);
        this.handleCreate = this.handleCreate.bind(this);
        this.setValue = this.setValue.bind(this);
    }

    public render(): JSX.Element {
        const { classes } = this.props;
        return (
            <DialogWrapper
                title="Create new project"
                submitFn={this.handleCreate}
                AddElement={
                    <Button variant="extendedFab" aria-label="Delete" className={classes.button}>
                        <AddIcon className={classes.extendedIcon} />
                        New project
                    </Button>
                }
            >
                <Form
                    fields={this.formFields}
                    requiredFields={this.requiredFormFields}
                    onValueChange={this.setValue}
                    values={this.state.slip}
                />
            </DialogWrapper>
        )
    }

    private handleCreate(): Promise<any> {
        return this.props.store.domainStore.createSlip(this.props.customer, this.state.slip)
            .then(() => {
                this.setState({ slip: this.emptySlip});
            })
            .catch((err) =>
                this.props.store.messagesStore.createMessage(prepareErrMessage(err), MessageTypes.ERROR));
    }

    private setValue(key: string, value: string) {
        const newSlip: ISlipForm = cloneDeep(this.state.slip);
        (newSlip as any)[key] = value;
        this.setState({...this.state, slip: newSlip});
    }
}

export default withStore(withStyles(styles)(observer(NewSlip)));
