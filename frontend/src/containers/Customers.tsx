import { filter } from "lodash";
import { Link } from "react-router-dom";
import { match } from "react-router";
import { observer } from "mobx-react"
import * as React from "react";

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { drawerWidth } from "../index";
import { ICustomer } from "../store/domain";
import { RootStore, withStore } from "../store/store";
import Customer from "../components/Customer";
import NavBar from "../components/NavBar";

const styles = (theme: any) => ({
    root: {
        display: 'flex',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing.unit * 3,
    },
    toolbar: theme.mixins.toolbar,
    link: {
        textDecoration: "none",
    }
});

interface IProps {
    store: RootStore;
    classes: any;
    match: match;
}

class WrappedCustomers extends React.Component<IProps, {}> {

    public componentDidMount() {
        this.props.store.domainStore.loadCustomers();
    }

    public render(): JSX.Element {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <CssBaseline />
                <NavBar />
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    anchor="left"
                >
                    <div className={classes.toolbar} />
                    <List>
                        {this.props.store.domainStore.customers.map((customer, index) => (
                            <ListItem button key={customer.id}>
                                <Link to={`/customers/${customer.id}`} className={classes.link}>
                                    <ListItemText primary={customer.title} />
                                </Link>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    {this.showCustomer()}
                </main>
            </div>
        );
    }

    private showCustomer(): JSX.Element {
        const params = this.props.match.params as any;
        if (!params.id) {
            return <span />;
        }

        const customers = filter(this.props.store.domainStore.customers,
            (customer: ICustomer) => customer.id === parseInt(params.id)
        );
        if (customers.length !== 1) {
            return <span />;
        }

        return <Customer customer={customers[0]} />
    }
}

export default withStyles(styles)(withStore(observer(WrappedCustomers)));
