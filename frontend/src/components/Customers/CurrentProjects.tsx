import * as React from "react";
import { observer } from "mobx-react"

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { RootStore, withStore } from "../../store/store";
import Customer from "../../models/customer";

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

class CurrentProject extends React.Component<IProps, {}> {

    public componentDidMount() {
        this.props.store.domainStore.loadSlips(this.props.customer.id);
    }

    public componentDidUpdate(prevProps: IProps, _prevState: any) {
        if (this.props.customer.id !== prevProps.customer.id) {
            this.props.store.domainStore.loadSlips(this.props.customer.id);
        }
    }

    public render(): JSX.Element {
        const { classes } = this.props;
        return (
            <Paper className={classes.root} elevation={1}>
                <Typography variant="h5" component="h3">Current projects</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell numeric>Rate</TableCell>
                            <TableCell>Timed</TableCell>
                            <TableCell numeric>Duration</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.props.store.domainStore.getCustomerSlips(this.props.customer.id).map(slip => {
                        return (
                        <TableRow key={slip.id}>
                            <TableCell component="th" scope="row">
                                {slip.name}
                            </TableCell>
                            <TableCell numeric>{slip.rate}</TableCell>
                            <TableCell>{slip.timed}</TableCell>
                            <TableCell numeric>{slip.duration}</TableCell>
                        </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

export default withStore(withStyles(styles)(observer(CurrentProject)));
