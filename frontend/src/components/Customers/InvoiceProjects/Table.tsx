import { map } from "lodash";
import * as React from "react";
import { observer } from "mobx-react"

import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import PdfIcon from '@material-ui/icons/FindInPage';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import { getCheckIcon, parseDate, toMoney } from "../../../utils";
import { RootStore, withStore } from "../../../store/store";
import ConfirmDialog from "../../ConfirmDialog";
import Customer from "../../../models/customer";
import InvoiceProject from "../../../models/invoice_project";
import NewInvoiceProject from "./New";
import Slip from "../../../models/slip";

interface IProps {
    store: RootStore;
    customer: Customer;
    classes: any;
}

interface IState {
    selectedInvoiceProject: InvoiceProject | null;
}

const styles = (theme: any) => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

class InvoiceProjects extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.handleDeleteDialogClose = this.handleDeleteDialogClose.bind(this);
        this.handleDeleteDialogConfirm = this.handleDeleteDialogConfirm.bind(this);
        this.state = {selectedInvoiceProject: null};
    }

    public componentDidMount() {
        this.props.store.domainStore.loadInvoiceProjects(this.props.customer.id);
    }

    public componentDidUpdate(prevProps: IProps, _prevState: any) {
        if (this.props.customer.id !== prevProps.customer.id) {
            this.props.store.domainStore.loadInvoiceProjects(this.props.customer.id);
        }
    }

    public render(): JSX.Element {
        const { classes } = this.props;
        return (
            <Paper className={classes.root} elevation={1}>
                <Typography variant="h5" component="h3">Invoice projects</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell numeric>Number</TableCell>
                            <TableCell>Projects</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell numeric>Price</TableCell>
                            <TableCell numeric>Total</TableCell>
                            <TableCell>Dowloaded</TableCell>
                            <TableCell>Invoiced</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.props.store.domainStore.getCustomerInvoiceProjects(this.props.customer.id).map((invoice_project: InvoiceProject) => {
                        return (
                            <TableRow key={invoice_project.id}>
                                <TableCell numeric>{invoice_project.number}</TableCell>
                                <TableCell>{this.slipsList(invoice_project.slips)}</TableCell>
                                <TableCell>{parseDate(invoice_project.date)}</TableCell>
                                <TableCell numeric>{toMoney(invoice_project.rate)}</TableCell>
                                <TableCell numeric>{toMoney(invoice_project.total)}</TableCell>
                                <TableCell>{getCheckIcon(invoice_project.downloaded)}</TableCell>
                                <TableCell>{getCheckIcon(invoice_project.invoiced)}</TableCell>
                                <TableCell>
                                    <IconButton
                                        aria-label="Delete"
                                        onClick={this.openDeleteDialog.bind(this, invoice_project)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton
                                        aria-label="Delete"
                                        onClick={this.openDeleteDialog.bind(this, invoice_project)}
                                    >
                                        <PdfIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
                <ConfirmDialog
                    cancelText="No"
                    confirmText="Yes"
                    handleCancel={this.handleDeleteDialogClose}
                    handleConfirm={this.handleDeleteDialogConfirm}
                    open={this.state.selectedInvoiceProject !== null}
                    text="Do you really want to delete the invoice project? This action won't reset the numbering"
                    title="Delete invoice project"
                />
                <NewInvoiceProject />
            </Paper>
        );
    }

    private handleDeleteDialogConfirm() {
        const invoiceProject = this.state.selectedInvoiceProject;
        if (invoiceProject === null) {
            return;
        }
        this.props.store.domainStore.deleteInvoiceProject(invoiceProject.id, invoiceProject.customer_id).then(() => {
            this.handleDeleteDialogClose();
        });
    }

    private handleDeleteDialogClose() {
        this.setState({selectedInvoiceProject: null});
    }

    private openDeleteDialog(invoiceProject: InvoiceProject) {
        this.setState({selectedInvoiceProject: invoiceProject});
    }

    private slipsList(slips: Slip[]): JSX.Element {
        return (
            <ul>
                {map(slips, slip => <li key={`slip_${slip.id}`}>{slip.name}</li>)}
            </ul>
        );
    }
}

export default withStore(withStyles(styles)(observer(InvoiceProjects)));
