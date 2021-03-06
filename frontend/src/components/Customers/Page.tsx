import * as React from "react";

import Grid from '@material-ui/core/Grid';

import CurrentProjects from "../Slips/Table";
import CustomerDetails from "./Details";
import CustomerModel from "../../models/customer";
import InvoiceProjects from "../InvoiceProjects/Table";
import Invoices from "../Invoices/Table";

interface IProps {
    customer: CustomerModel;
}

export default class extends React.Component<IProps, {}> {
    public render(): JSX.Element {
        return (
            <React.Fragment>
                <Grid container spacing={24}>
                    <Grid item xs={6}>
                        <CustomerDetails customer={this.props.customer} />
                    </Grid>
                    <Grid item xs={6}>
                        <CurrentProjects customer={this.props.customer} />
                    </Grid>
                </Grid>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <InvoiceProjects customer={this.props.customer} />
                    </Grid>
                </Grid>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <Invoices customer={this.props.customer} />
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}
