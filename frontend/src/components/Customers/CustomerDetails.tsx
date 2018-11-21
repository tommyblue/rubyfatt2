import * as React from "react";

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Customer from "../../models/customer";

const styles = (theme: any) => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

const CustomerDetails = (props: {customer: Customer, classes: any}) => (
    <Paper className={props.classes.root} elevation={1}>
        <Typography variant="h5" component="h3">
        {props.customer.title}
        </Typography>
        <Typography variant="body1" component="p" gutterBottom>
            {props.customer.fullName}
        </Typography>
        <Typography variant="body1" component="p" gutterBottom>
            {props.customer.fullAddress}
        </Typography>
        <Typography variant="body1" component="p" gutterBottom>
            VAT: {props.customer.vat || "-"}
        </Typography>
        <Typography variant="body1" component="p" gutterBottom>
            Tax code: {props.customer.tax_code || "-"}
        </Typography>
        <Typography variant="body1" component="div" gutterBottom>
            <div dangerouslySetInnerHTML={{ __html: props.customer.info }} />
        </Typography>
    </Paper>
);

export default withStyles(styles)(CustomerDetails);
