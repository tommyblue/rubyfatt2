import { Link } from "react-router-dom";
import { observer } from "mobx-react"
import * as React from "react";

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { RootStore, withStore } from "../store/store";

const styles = (theme: any) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    logo: {
        color: "white",
        textDecoration: "none"
    }
});

interface IProps {
    store: RootStore;
    classes: any;
    onMenuButtonClick: () => void;
}

class WrappedNavBar extends React.Component<IProps, {}> {
    public render(): JSX.Element {
        const { classes } = this.props;
        return (
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" color="inherit" className={classes.grow}>
                        <Link to="/" className={classes.logo}>Rubyfatt 2</Link>
                    </Typography>
                    {this.authButtons()}
                </Toolbar>
            </AppBar>
        )
    }

    private authButtons(): JSX.Element {
        if (this.props.store.authStore.isAuthenticated) {
            return (<Button color="inherit" onClick={(e) => this.props.store.authStore.signOut()}>Sign out</Button>);
        }
        return <span />;
    }
}

export default withStyles(styles)(withStore(observer(WrappedNavBar)));
