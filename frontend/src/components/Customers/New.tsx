import { cloneDeep, map, join, capitalize } from "lodash";
import { observer } from "mobx-react"
import * as React from "react";

import AddIcon from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { ICustomer } from "../../models/customer";
import { MessageTypes } from "../../store/messages";
import { RootStore, withStore } from "../../store/store";
import Form from "./Form";

interface IProps {
    store: RootStore;
    classes: any;
}

interface IState {
    open: boolean;
    customer: ICustomer;
}

class New extends React.Component<IProps, IState> {
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
    state: IState = { open: false, customer: this.emptyCustomer};

    constructor(props: IProps) {
        super(props);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.setValue = this.setValue.bind(this);
    }

    public render(): JSX.Element {
        return (
            <ListItem button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Create new customer</DialogTitle>
                    <DialogContent>
                        <Form onValueChange={this.setValue} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Cancel</Button>
                        <Button onClick={this.handleCreate} color="primary">Create</Button>
                    </DialogActions>
                </Dialog>
                <ListItemIcon>
                    <AddIcon />
                </ListItemIcon>
                <ListItemText primary="New Customer" onClick={this.handleOpen} />
            </ListItem>
        );
    }

    private handleOpen() {
        this.setState({...this.state, open: true});
    }

    private handleClose() {
        this.setState({...this.state, open: false, customer: this.emptyCustomer});
    }

    private handleCreate() {
        this.props.store.domainStore.createCustomer(this.state.customer).then(
            () => this.setState({...this.state, open: false})
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

export default withStore(observer(New));
