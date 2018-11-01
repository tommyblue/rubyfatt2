import * as React from "react";
import { Link } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import NewCustomer from "./New";
import Customer from "../../models/customer";

const styles = (theme: any) => ({
    link: {
        textDecoration: "none",
    }
});

interface IProps {
    classes: any;
    customers: Customer[];
}

const CustomersList = (props: IProps) => (
    <List>
        <NewCustomer />
        <Divider />
        {props.customers.map((customer) => (
            <Link to={`/customers/${customer.id}`} className={props.classes.link} key={customer.id}>
                <ListItem button>
                    <ListItemText primary={customer.title} />
                </ListItem>
            </Link>
        ))}
    </List>
);

export default withStyles(styles)(CustomersList);

