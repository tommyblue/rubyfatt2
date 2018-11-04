import * as React from "react";
import { observer } from "mobx-react"

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import { getCheckIcon, parseDate, toMoney } from "../../utils";
import { RootStore, withStore } from "../../store/store";
import Customer from "../../models/customer";
import InvoiceProject from "../../models/invoice_project";

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

class InvoiceProjects extends React.Component<IProps, {}> {

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
                            <TableCell>Date</TableCell>
                            <TableCell numeric>Price</TableCell>
                            <TableCell numeric>Total</TableCell>
                            <TableCell>Dowloaded</TableCell>
                            <TableCell>Invoiced</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.props.store.domainStore.getCustomerInvoiceProjects(this.props.customer.id).map((invoice_project: InvoiceProject) => {
                        return (
                            <TableRow key={invoice_project.id}>
                                <TableCell numeric>{invoice_project.number}</TableCell>
                                <TableCell>{parseDate(invoice_project.date)}</TableCell>
                                <TableCell numeric>{toMoney(invoice_project.rate)}</TableCell>
                                <TableCell numeric>{toMoney(invoice_project.total)}</TableCell>
                                <TableCell>{getCheckIcon(invoice_project.downloaded)}</TableCell>
                                <TableCell>{getCheckIcon(invoice_project.invoiced)}</TableCell>
                            </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

export default withStore(withStyles(styles)(observer(InvoiceProjects)));
