import { map } from "lodash";
import * as React from "react";
import { observer } from "mobx-react"

import { withStyles } from '@material-ui/core/styles';
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
import Invoice from "../../models/invoice";
import Slip from "../../models/slip";

interface IProps {
    store: RootStore;
    customer: Customer;
    classes: any;
}

interface IState {
    selectedInvoice: Invoice | null;
    isPrinting: boolean;
    printingUrl: string | null;
}

const styles = (theme: any) => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
    progress: {
        margin: theme.spacing.unit * 2,
    },
});

class Invoices extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.handleDeleteDialogClose = this.handleDeleteDialogClose.bind(this);
        this.handleDeleteDialogConfirm = this.handleDeleteDialogConfirm.bind(this);
        this.handlePdfPopupClose = this.handlePdfPopupClose.bind(this);

        this.state = {selectedInvoice: null, isPrinting: false, printingUrl: null};
    }

    public componentDidMount() {
        this.props.store.domainStore.loadInvoices(this.props.customer.id);
    }

    public componentDidUpdate(prevProps: IProps, _prevState: any) {
        if (this.props.customer.id !== prevProps.customer.id) {
            this.props.store.domainStore.loadInvoices(this.props.customer.id);
        }
    }

    public render(): JSX.Element {
        const { classes } = this.props;
        return (
            <Paper className={classes.root} elevation={1}>
                <Typography variant="h5" component="h3">Invoices</Typography>
                <Table padding="dense">
                    <TableHead>
                        <TableRow>
                            <TableCell numeric>Number</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Projects</TableCell>
                            <TableCell numeric>Price</TableCell>
                            <TableCell numeric>Total</TableCell>
                            <TableCell>Downloaded</TableCell>
                            <TableCell>Paid</TableCell>
                            <TableCell>Payment date</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.props.store.domainStore.getCustomerInvoices(this.props.customer.id).map((invoice: Invoice) => {
                        return (
                            <TableRow key={invoice.id}>
                                <TableCell numeric>{invoice.number}</TableCell>
                                <TableCell>{this.slipsList(invoice.slips)}</TableCell>
                                <TableCell>{parseDate(invoice.date)}</TableCell>
                                <TableCell numeric>{toMoney(invoice.rate)}</TableCell>
                                <TableCell numeric>{toMoney(invoice.total)}</TableCell>
                                <TableCell>{getCheckIcon(invoice.downloaded)}</TableCell>
                                <TableCell>{getCheckIcon(invoice.payment_date !== null)}</TableCell>
                                <TableCell>{parseDate(invoice.payment_date)}</TableCell>
                                <TableCell className="nowrap">
                                    <IconButton
                                        aria-label="Delete"
                                        onClick={this.openDeleteDialog.bind(this, invoice)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton
                                        aria-label="Print"
                                        onClick={this.handlePrint.bind(this, invoice)}
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
                    isOpen={this.state.selectedInvoice !== null}
                    content="Do you really want to delete the invoice? This action won't reset the numbering"
                    title="Delete invoice"
                />
                <ConfirmDialog
                    confirmText="Close"
                    handleConfirm={this.handlePdfPopupClose}
                    handleClose={this.handlePdfPopupClose}
                    isOpen={this.state.isPrinting}
                    content={this.getPrintContent()}
                    title="Printing"
                />
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

    private handlePrint(invoice: Invoice) {
        if (invoice === null) {
            return;
        }
        this.setState({...this.state, isPrinting: true});

        this.props.store.domainStore.printInvoice(invoice.id, invoice.customer_id).then((url: string) => {
            this.setState({...this.state, printingUrl: url});
        });
    }

    private handlePdfPopupClose() {
        this.setState({...this.state, isPrinting: false, printingUrl: null});
    }

    private handleDeleteDialogConfirm() {
        const invoice = this.state.selectedInvoice;
        if (invoice === null) {
            return;
        }
        this.props.store.domainStore.deleteInvoice(invoice.id, invoice.customer_id).then(() => {
            this.handleDeleteDialogClose();
        });
    }

    private handleDeleteDialogClose() {
        this.setState({selectedInvoice: null});
    }

    private openDeleteDialog(invoice: Invoice) {
        this.setState({selectedInvoice: invoice});
    }


    private slipsList(slips: Slip[]): JSX.Element {
        return (
            <ul>
                {map(slips, slip => <li key={`slip_${slip.id}`}>{slip.name}</li>)}
            </ul>
        );
    }
}

export default withStore(withStyles(styles)(observer(Invoices)));
