import { observer } from "mobx-react"
import * as React from "react";

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import { RootStore, withStore } from "../store/store";

const styles = {
    root: {
      flexGrow: 1,
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
  };

interface IProps {
    store: RootStore;
    classes: any;
}

class WrappedNavBar extends React.Component<IProps, {}> {
    public render(): JSX.Element {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            Rubyfatt2
                        </Typography>
                        {this.authButtons()}
                    </Toolbar>
                </AppBar>
            </div>
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
