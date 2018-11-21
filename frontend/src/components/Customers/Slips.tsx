import { cloneDeep } from "lodash";
import * as React from "react";
import { observer } from "mobx-react"

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import { getCheckIcon, toMoney } from "../../utils";
import { RootStore, withStore } from "../../store/store";
import ConfirmDialog from "../ConfirmDialog";
import Customer from "../../models/customer";
import NewSlip from "./NewSlip";
import Slip from "../../models/slip";

interface IProps {
    store: RootStore;
    customer: Customer;
    classes: any;
}

interface IState {
    deleteDialogs: {[id: number]: boolean};
}

const styles = (theme: any) => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
    button: {
        margin: theme.spacing.unit,
    },
});

class CurrentProject extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {deleteDialogs: {}};
        this.toggleDeleteDialog = this.toggleDeleteDialog.bind(this);
    }

    public componentDidMount() {
        this.props.store.domainStore.loadSlips(this.props.customer.id);
    }

    public componentDidUpdate(prevProps: IProps, _prevState: any) {
        if (this.props.customer.id !== prevProps.customer.id) {
            this.props.store.domainStore.loadSlips(this.props.customer.id);
        }
    }

    public render(): JSX.Element {
        const { classes, customer, store } = this.props;
        return (
            <Paper className={classes.root} elevation={1}>
                <Typography variant="h5" component="h3">Current projects</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell numeric>Rate</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {store.domainStore.getCustomerSlips(customer.id).map(slip => {
                        return (
                        <TableRow key={slip.id}>
                            <TableCell component="th" scope="row">
                                {slip.name}
                            </TableCell>
                            <TableCell numeric>{toMoney(slip.rate)}</TableCell>
                            <TableCell>
                            <IconButton
                                className={this.props.classes.button}
                                aria-label="Delete"
                                onClick={this.openDeleteDialog.bind(this, slip.id)}
                            >
                                <DeleteIcon />
                            </IconButton>
                                <ConfirmDialog
                                    cancelText="No"
                                    confirmText="Yes"
                                    handleCancel={this.handleDeleteDialogClose.bind(this, slip.id)}
                                    handleConfirm={this.handleDeleteDialogConfirm.bind(this, slip.id, slip.customer_id)}
                                    open={this.isDeleteDialogOpen(slip.id)}
                                    text={`Do you really want to delete the project "${slip.name}"?`}
                                    title="Delete project"
                                />
                            </TableCell>
                        </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
                <NewSlip customer={this.props.customer} />
            </Paper>
        );
    }

    private handleDeleteDialogConfirm(slipId: number, customerId: number) {
        this.props.store.domainStore.deleteSlip(slipId, customerId).then(() => {
            this.handleDeleteDialogClose(slipId);
        });
    }

    private handleDeleteDialogClose(slipId: number) {
        this.toggleDeleteDialog(slipId, false);
    }

    private openDeleteDialog(slipId: number) {
        this.toggleDeleteDialog(slipId, true);
    }

    private toggleDeleteDialog(slipId: number, val: boolean) {
        const deleteDialogs = cloneDeep(this.state.deleteDialogs);
        deleteDialogs[slipId] = val;
        this.setState({
            ...this.state,
            deleteDialogs,
        });
    }

    private isDeleteDialogOpen(slipId: number) {
        return this.state.deleteDialogs[slipId] === true;
    }
}

export default withStore(withStyles(styles)(observer(CurrentProject)));
