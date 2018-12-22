import { cloneDeep, map, join, capitalize } from "lodash";
import { observer } from "mobx-react"
import * as React from "react";

import { withStyles, Theme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button';

import { IInvoiceProject } from "../../models/invoice_project";
import { MessageTypes } from "../../store/messages";
import { prepareErrMessage } from "../../utils";
import { RootStore, withStore } from "../../store/store";
import Customer from "../../models/customer";
import Form, { FormField } from "../Form";
import NewWrapper from "../DialogWrapper";
import Checkbox from "../Forms/Checkbox";
import Radio from "../Forms/Radio";

interface IProps {
    store: RootStore;
    classes: any;
    customer: Customer;
}

interface IState {
    invoice_project: IInvoiceProject;
}

const styles = (theme: Theme) => ({
    button: {
      margin: theme.spacing.unit,
    },
    extendedIcon: {
      marginRight: theme.spacing.unit,
    },
});

class NewInvoiceProject extends React.Component<IProps, IState> {
    formFields: FormField[] = [];
    requiredFormFields: string[] = [];
    emptyInvoiceProject: IInvoiceProject = {
        date: "",
        customer_id: 0,
        number: 0,
        invoiced: false,
        downloaded: false,
        rate: "",
        total: "",
        slips: [],
        consolidated_tax_id: null,
    };
    state: IState = { invoice_project: this.emptyInvoiceProject};

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
                selectedValue: this.state.invoice_project.consolidated_tax_id,
            },
        }, {
            name: "slips",
            type: Checkbox,
            componentProps: {
                handleChange: this.setValue,
                legend: "Slips",
                name: "slips",
                options: map(this.props.store.domainStore.slips[this.props.customer.id], s => ({
                    label: s.name,
                    value: s.id.toString(),
                })),
                selectedValue: this.state.invoice_project.slips,
            },
        }];
        const { classes } = this.props;
        return (
            <NewWrapper
                title="Create new invoice project"
                handleCloseObject={this.emptyInvoiceProject}
                submitFn={this.handleCreate}
                AddElement={
                    <Button
                        variant="extendedFab"
                        aria-label="Delete"
                        className={classes.button}
                        disabled={this.isButtonDisabled()}
                    >
                        <AddIcon className={classes.extendedIcon} />
                        New invoice project
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
        return this.props.store.domainStore.getCustomerSlips(this.props.customer.id).length === 0;
    }

    private handleCreate(): Promise<any> {
        return this.props.store.domainStore.createInvoiceProject(this.state.invoice_project).then(
            () => this.setState({...this.state})
        ).catch((err) => this.props.store.messagesStore.createMessage(prepareErrMessage(err), MessageTypes.ERROR));
    }

    private setValue(key: string, value: string | string[]) {
        const newInvoiceProject: IInvoiceProject = cloneDeep(this.state.invoice_project);
        (newInvoiceProject as any)[key] = value;
        this.setState({...this.state, invoice_project: newInvoiceProject});
    }
}

export default withStore(withStyles(styles)(observer(NewInvoiceProject)));
