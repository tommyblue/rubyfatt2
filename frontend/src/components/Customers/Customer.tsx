import * as React from "react";

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import CustomerModel from "../../models/customer";

interface IProps {
    classes: any;
    customer: CustomerModel;
}

const styles = (theme: any) => ({
    root: {
      ...theme.mixins.gutters(),
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2,
    },
  });

class Customer extends React.Component<IProps, {}> {
    public render(): JSX.Element {
        const { classes } = this.props;
        console.log(this.props.customer.info)
        return (
            <Paper className={classes.root} elevation={1}>
                <Typography variant="h5" component="h3">
                {this.props.customer.title}
                </Typography>
                <Typography variant="body1" component="p" gutterBottom>
                    {this.props.customer.fullName}
                </Typography>
                <Typography variant="body1" component="p" gutterBottom>
                    {this.props.customer.fullAddress}
                </Typography>
                <Typography variant="body1" component="p" gutterBottom>
                    VAT: {this.props.customer.vat || "-"}
                </Typography>
                <Typography variant="body1" component="p" gutterBottom>
                    Tax code: {this.props.customer.tax_code || "-"}
                </Typography>
                <Typography variant="body1" component="p" gutterBottom>
                    <div dangerouslySetInnerHTML={{ __html: this.props.customer.info }} />
                </Typography>
            </Paper>
        );
    }
}

export default withStyles(styles)(Customer);
