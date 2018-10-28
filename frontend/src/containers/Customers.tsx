import * as React from "react";
import { observer } from "mobx-react"

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { drawerWidth } from "../index";
import { RootStore, withStore } from "../store/store";
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
});

interface IProps {
    store: RootStore;
    classes: any;
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
                                <ListItemText primary={customer.title} />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
                <main className={classes.content}>
                asd

                </main>
            </div>
        );
    }
}

export default withStyles(styles)(withStore(observer(WrappedCustomers)));
