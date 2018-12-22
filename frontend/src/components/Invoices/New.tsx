import { cloneDeep, map, join, capitalize, filter } from "lodash";
import { observer } from "mobx-react"
import * as React from "react";

import { withStyles, Theme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button';

import { IInvoice } from "../../models/invoice";
import { MessageTypes } from "../../store/messages";
import { prepareErrMessage } from "../../utils";
import { RootStore, withStore } from "../../store/store";
import Customer from "../../models/customer";
import Form, { FormField } from "../Form";
import InvoiceProject from "../../models/invoice_project";
import NewWrapper from "../DialogWrapper";
import Radio from "../Forms/Radio";

interface IProps {
    store: RootStore;
    classes: any;
    customer: Customer;
}

interface IState {
    invoice: IInvoice;
}

const styles = (theme: Theme) => ({
    button: {
      margin: theme.spacing.unit,
    },
    extendedIcon: {
      marginRight: theme.spacing.unit,
    },
});

class NewInvoice extends React.Component<IProps, IState> {
    formFields: FormField[] = [];
    requiredFormFields: string[] = [];
    emptyInvoice: IInvoice = {
        date: "",
        customer_id: 0,
        number: 0,
        payment_date: null,
        downloaded: false,
        rate: "",
        total: "",
        slips: [],
        consolidated_tax_id: null,
    };
    state: IState = { invoice: this.emptyInvoice};

    constructor(props: IProps) {
        super(props);
        this.handleCreate = this.handleCreate.bind(this);
        this.setValue = this.setValue.bind(this);
    }

    public render(): JSX.Element {
        this.formFields = [{
            name: "consolidated_tax_id",
            type: Radio,
            componentProps: {
                handleChange: this.setValue,
                legend: "Consolidated Taxes",
                name: "consolidated_tax_id",
                options: map(this.props.store.domainStore.consolidated_taxes, ct => ({
                    label: ct.name,
                    value: ct.id.toString(),
                })),
                selectedValue: this.state.invoice.consolidated_tax_id,
            },
        }];
        const { classes } = this.props;
        return (
            <NewWrapper
                title="Create new invoice"
                handleCloseObject={this.emptyInvoice}
                submitFn={this.handleCreate}
                AddElement={
                    <Button
                        variant="extendedFab"
                        aria-label="Delete"
                        className={classes.button}
                        disabled={this.isButtonDisabled()}
                    >
                        <AddIcon className={classes.extendedIcon} />
                        New invoice
                    </Button>
                }
            >
                <Form
                    fields={this.formFields}
                    requiredFields={this.requiredFormFields}
                    onValueChange={this.setValue}
                />
            </NewWrapper>
        );
    }

    private isButtonDisabled(): boolean {
        // TODO
        // Get uninvoiced invoice projects
        return filter(this.props.store.domainStore.getCustomerInvoiceProjects(this.props.customer.id), (ip: InvoiceProject) => (
            ip.invoiced === false
        )).length === 0;
    }

    private handleCreate(): Promise<any> {
        return this.props.store.domainStore.createInvoice(this.state.invoice).then(
            () => this.setState({...this.state})
        ).catch((err) => this.props.store.messagesStore.createMessage(prepareErrMessage(err), MessageTypes.ERROR));
    }

    private setValue(key: string, value: string) {
        const newInvoice: IInvoice = cloneDeep(this.state.invoice);
        (newInvoice as any)[key] = value;
        this.setState({...this.state, invoice: newInvoice});
    }
}

export default withStore(withStyles(styles)(observer(NewInvoice)));
