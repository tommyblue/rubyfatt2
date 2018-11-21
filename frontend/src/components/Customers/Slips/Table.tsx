import { cloneDeep } from "lodash";
import * as React from "react";
import { observer } from "mobx-react"

import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import { RootStore, withStore } from "../../../store/store";
import { toMoney } from "../../../utils";
import ConfirmDialog from "../../ConfirmDialog";
import Customer from "../../../models/customer";
import EditSlip from "./Edit";
import NewSlip from "./New";
import Slip from "../../../models/slip";

interface IProps {
    store: RootStore;
    customer: Customer;
    classes: any;
}

interface IState {
    selectedSlip: null | Slip;
    action: null | string;
}

const styles = (theme: any) => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

class CurrentProject extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {selectedSlip: null, action: ""};
        this.handleDeleteDialogClose = this.handleDeleteDialogClose.bind(this);
        this.handleDeleteDialogConfirm = this.handleDeleteDialogConfirm.bind(this);
        this.handleEditDialogClose = this.handleEditDialogClose.bind(this);
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
                                    aria-label="Edit"
                                    onClick={this.openEditDialog.bind(this, slip)}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    aria-label="Delete"
                                    onClick={this.openDeleteDialog.bind(this, slip)}
                                >
                                    <DeleteIcon />
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
                    open={this.state.selectedSlip !== null && this.state.action == "delete"}
                    text="Do you really want to delete the project?"
                    title="Delete project"
                />
                <EditSlip onDialogClose={this.handleEditDialogClose} slip={this.getEditSlip()} customer={this.props.customer} />
                <NewSlip customer={this.props.customer} />
            </Paper>
        );
    }

    private handleEditDialogClose() {
        this.setState({action: null, selectedSlip: null});
    }

    private getEditSlip(): null | Slip {
        if (this.state.action === "edit" && this.state.selectedSlip !== null) {
            return this.state.selectedSlip;
        }
        return null;
    }

    private handleDeleteDialogConfirm() {
        const slip = this.state.selectedSlip;
        if (slip === null) {
            return;
        }
        this.props.store.domainStore.deleteSlip(slip.id, slip.customer_id).then(() => {
            this.handleDeleteDialogClose();
        });
    }

    private handleDeleteDialogClose() {
        this.setState({selectedSlip: null, action: ""});
    }

    private openEditDialog(slip: Slip) {
        this.setState({selectedSlip: slip, action: "edit"});
    }

    private openDeleteDialog(slip: Slip) {
        this.setState({selectedSlip: slip, action: "delete"});
    }
}

export default withStore(withStyles(styles)(observer(CurrentProject)));
