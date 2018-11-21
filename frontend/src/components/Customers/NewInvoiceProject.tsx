import { cloneDeep, map, join, capitalize } from "lodash";
import { observer } from "mobx-react"
import * as React from "react";

import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button';

import { IInvoiceProject } from "../../models/invoice_project";
import { MessageTypes } from "../../store/messages";
import { RootStore, withStore } from "../../store/store";
import NewInvoiceProjectForm from "./Forms/InvoiceProject";
import NewWrapper from "./DialogWrapper";

interface IProps {
    store: RootStore;
    classes: any;
}

interface IState {
    invoice_project: IInvoiceProject;
}

const styles = (theme: any) => ({
    button: {
      margin: theme.spacing.unit,
    },
    extendedIcon: {
      marginRight: theme.spacing.unit,
    },
});

class NewInvoiceProject extends React.Component<IProps, IState> {
    emptyInvoiceProject: IInvoiceProject = {
        date: "",
        customer_id: 0,
        number: 0,
        invoiced: false,
        downloaded: false,
        rate: "",
        total: "",
    };
    state: IState = { invoice_project: this.emptyInvoiceProject};

    constructor(props: IProps) {
        super(props);
        this.handleCreate = this.handleCreate.bind(this);
        this.setValue = this.setValue.bind(this);
    }

    public render(): JSX.Element {
        const { classes } = this.props;
        return (
            <NewWrapper
                title="Create new invoice project"
                handleCloseObject={this.emptyInvoiceProject}
                submitFn={this.handleCreate}
                AddElement={
                    <Button variant="extendedFab" aria-label="Delete" className={classes.button}>
                        <AddIcon className={classes.extendedIcon} />
                        New invoice project
                    </Button>
                }
            >
                <NewInvoiceProjectForm onValueChange={this.setValue} />
            </NewWrapper>
        );
    }

    private handleCreate(): Promise<any> {
        return this.props.store.domainStore.createInvoiceProject(this.state.invoice_project).then(
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
        const newInvoiceProject: IInvoiceProject = cloneDeep(this.state.invoice_project);
        (newInvoiceProject as any)[key] = value;
        this.setState({...this.state, invoice_project: newInvoiceProject});
    }
}

export default withStyles(styles)(withStore(observer(NewInvoiceProject)));