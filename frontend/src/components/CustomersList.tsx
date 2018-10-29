import * as React from "react";
import { Link } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { ICustomer } from "../store/domain";

const styles = (theme: any) => ({
    link: {
        textDecoration: "none",
    }
});

interface IProps {
    classes: any;
    customers: ICustomer[];
}

const CustomersList = (props: IProps) => (
    <List>
        {props.customers.map((customer, index) => (
            <ListItem button key={customer.id}>
                <Link to={`/customers/${customer.id}`} className={props.classes.link}>
                    <ListItemText primary={customer.title} />
                </Link>
            </ListItem>
        ))}
    </List>
);

export default withStyles(styles)(CustomersList);

