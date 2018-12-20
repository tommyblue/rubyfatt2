import { map } from "lodash";
import * as React from "react";
import { observer } from "mobx-react"

import { withStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import OpenInNew from '@material-ui/icons/OpenInNew';
import Paper from '@material-ui/core/Paper';
import PdfIcon from '@material-ui/icons/FindInPage';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import { getCheckIcon, parseDate, toMoney } from "../../utils";
import { RootStore, withStore } from "../../store/store";
import ConfirmDialog from "../ConfirmDialog";
import Customer from "../../models/customer";
import InvoiceProject from "../../models/invoice_project";
import NewInvoiceProject from "./New";
import Slip from "../../models/slip";

interface IProps {
    store: RootStore;
    customer: Customer;
    classes: any;
}

interface IState {
    selectedInvoiceProject: InvoiceProject | null;
    isPrinting: boolean;
    printingUrl: string | null;
}

const styles = (theme: Theme) => ({
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
        this.handlePdfPopupClose = this.handlePdfPopupClose.bind(this);

        this.state = {selectedInvoiceProject: null, isPrinting: false, printingUrl: null};
    }

    public componentDidMount() {
        this.props.store.domainStore.loadInvoiceProjects(this.props.customer.id);
        this.props.store.domainStore.loadConsolidatedTaxes();
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
                <Table padding="dense">
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
                                <TableCell className="nowrap">
                                    <IconButton
                                        aria-label="Delete"
                                        onClick={this.openDeleteDialog.bind(this, invoice_project)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton
                                        aria-label="Delete"
                                        onClick={this.handlePrint.bind(this, invoice_project)}
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
                    isOpen={this.state.selectedInvoiceProject !== null}
                    content="Do you really want to delete the invoice project? This action won't reset the numbering"
                    title="Delete invoice project"
                />
                <ConfirmDialog
                    confirmText="Close"
                    handleConfirm={this.handlePdfPopupClose}
                    handleClose={this.handlePdfPopupClose}
                    isOpen={this.state.isPrinting}
                    content={this.getPrintContent()}
                    title="Printing"
                />
                <NewInvoiceProject customer={this.props.customer} />
            </Paper>
        );
    }

    private getPrintContent(): JSX.Element {
        if (this.state.printingUrl) {
            return (
                <>
                    <Button
                        aria-label="Print"
                        onClick={() => {
                            const tab = window.open(this.state.printingUrl, '_blank');
                            tab.focus();
                        }}
                    >
                        <OpenInNew />
                        Open PDF
                    </Button>
                </>
            );
        }
        return <CircularProgress className={this.props.classes.progress} />;
    }

    private handlePrint(invoiceProject: InvoiceProject) {
        if (invoiceProject === null) {
            return;
        }
        this.setState({...this.state, isPrinting: true});

        this.props.store.domainStore.printInvoiceProject(invoiceProject.id, invoiceProject.customer_id).then((url: string) => {
            this.setState({...this.state, printingUrl: url});
        });
    }

    private handlePdfPopupClose() {
        this.setState({...this.state, isPrinting: false, printingUrl: null});
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
