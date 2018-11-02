import * as React from "react";
import { observer } from "mobx-react"

import { withStyles } from '@material-ui/core/styles';
import Clear from '@material-ui/icons/Clear';
import Done from '@material-ui/icons/Done';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import { RootStore, withStore } from "../../store/store";
import Customer from "../../models/customer";
import Invoice from "../../models/invoice";

interface IProps {
    store: RootStore;
    customer: Customer;
    classes: any;
}

const styles = (theme: any) => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

class Invoices extends React.Component<IProps, {}> {

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
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell numeric>Number</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Dowloaded</TableCell>
                            <TableCell>Invoiced</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.props.store.domainStore.getCustomerInvoices(this.props.customer.id).map((invoice: Invoice) => {
                        return (
                            <TableRow key={invoice.id}>
                                <TableCell>{invoice.number}</TableCell>
                                <TableCell numeric>{invoice.date}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell>{invoice.payment_date}</TableCell>
                                <TableCell>{this.getIcon(invoice.downloaded)}</TableCell>
                            </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
            </Paper>
        );
    }

    private getIcon(val: boolean): JSX.Element {
        if (val) {
            return <Done />;
        }

        return <Clear />;
    }
}

export default withStore(withStyles(styles)(observer(Invoices)));
