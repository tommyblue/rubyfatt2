import { cloneDeep, map, join, capitalize } from "lodash";
import { observer } from "mobx-react"
import * as React from "react";

import AddIcon from '@material-ui/icons/AddCircle';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';

import { ICustomer } from "../../models/customer";
import { MessageTypes } from "../../store/messages";
import { RootStore, withStore } from "../../store/store";
import DialogWrapper from "../DialogWrapper";
import Form, { FormField } from "../Form";

interface IProps {
    store: RootStore;
}

interface IState {
    customer: ICustomer;
}

class NewCustomer extends React.Component<IProps, IState> {
    private fields: string[] = ["title", "name", "surname", "address", "zip_code", "town", "province",
    "country", "tax_code", "vat", "info"];
    formFields: FormField[] = map(this.fields, f => ({
        name: f,
        type: TextField,
    }));
    requiredFormFields: string[] = ["title"];
    emptyCustomer: ICustomer = {
        title: "",
        name: "",
        surname: "",
        address: "",
        zip_code: "",
        town: "",
        province: "",
        country: "",
        tax_code: "",
        vat: "",
        info: "",
    };
    state: IState = { customer: this.emptyCustomer};

    constructor(props: IProps) {
        super(props);
        this.handleCreate = this.handleCreate.bind(this);
        this.setValue = this.setValue.bind(this);
    }

    public render(): JSX.Element {
        return (
            <ListItem button>
                <DialogWrapper
                    title="Create new customer"
                    submitFn={this.handleCreate}
                    AddElement={
                        <>
                            <ListItemIcon>
                                <AddIcon />
                            </ListItemIcon>
                            <ListItemText primary="New Customer" />
                        </>
                    }
                >
                    <Form
                        fields={this.formFields}
                        requiredFields={this.requiredFormFields}
                        onValueChange={this.setValue}
                    />
                </DialogWrapper>
            </ListItem>
        );
    }

    private handleCreate(): Promise<any> {
        return this.props.store.domainStore.createCustomer(this.state.customer).then(
            () => this.setState({...this.state})
        ).catch((err) => this.props.store.messagesStore.createMessage(this.prepareMessage(err), MessageTypes.ERROR));
    }

    private prepareMessage(errors: any): string {
        return join(
            map(errors, (fields) => map(fields, (v, k) => `${capitalize(k)} ${v}`))
            , ", "
        );
    }

    private setValue(key: string, value: string) {
        const newCustomer: ICustomer = cloneDeep(this.state.customer);
        (newCustomer as any)[key] = value;
        this.setState({...this.state, customer: newCustomer});
    }
}

export default withStore(observer(NewCustomer));
