import { cloneDeep } from "lodash";
import { observer } from "mobx-react"
import * as React from "react";

import TextField from "@material-ui/core/TextField";

import { ISlipForm } from "../../models/slip";
import { MessageTypes } from "../../store/messages";
import { prepareErrMessage } from "../../utils";
import { RootStore, withStore } from "../../store/store";
import Customer from "../../models/customer";
import DialogWrapper from "../DialogWrapper";
import Slip from "../../models/slip";
import Form, { FormField } from "../Form";

interface IProps {
    store: RootStore;
    customer: Customer;
    slip: Slip | null;
    onDialogClose: () => void;
}

interface IState {
    slip: ISlipForm;
}

class EditSlip extends React.Component<IProps, IState> {

    private formFields: FormField[] = [{
        type: TextField,
        name: "name",
    }, {
        type: TextField,
        name: "rate",
    }];

    private requiredFormFields: string[] = ["name"];

    constructor(props: IProps) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.setValue = this.setValue.bind(this);

        this.state = {slip: null};
    }

    public render(): JSX.Element {
        return (
            <DialogWrapper
                title="Edit project"
                submitFn={this.handleUpdate}
                showDialog={this.props.slip !== null}
                handleCloseFn={this.handleClose}
            >
                <Form
                    fields={this.formFields}
                    requiredFields={this.requiredFormFields}
                    onValueChange={this.setValue}
                    values={this.getValues()}
                />
            </DialogWrapper>
        )
    }

    private handleClose() {
        this.setState({slip: null});
        this.props.onDialogClose();
    }

    private getValues() {
        if (this.state.slip !== null) {
            return this.state.slip;
        }
        return this.props.slip;
    }

    private handleUpdate(): Promise<any> {
        if (this.state.slip === null) {
            return new Promise((resolve, _) => {resolve(this.handleClose())}, );
        }
        return this.props.store.domainStore.editSlip(this.props.customer.id, this.props.slip.id, this.state.slip)
            .then(() => this.handleClose())
            .catch((err) =>
                this.props.store.messagesStore.createMessage(prepareErrMessage(err), MessageTypes.ERROR));
    }

    private setValue(key: string, value: string) {
        let newSlip: ISlipForm | null = cloneDeep(this.state.slip);
        if (this.state.slip === null) {
            newSlip = {
                name: this.props.slip.name,
                rate: this.props.slip.rate,
            }
        }
        (newSlip as any)[key] = value;
        this.setState({...this.state, slip: newSlip});
    }
}

export default withStore(observer(EditSlip));
