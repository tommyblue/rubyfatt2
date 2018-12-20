import * as React from "react";

import { withStyles, Theme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

import { drawerWidth } from "../index";

interface IProps {
    children: JSX.Element;
    classes: any;
}

const styles = (theme: Theme) => ({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
});

const Sidebar = (props: IProps) => (
    <Drawer
        className={props.classes.drawer}
        variant="permanent"
        classes={{
            paper: props.classes.drawerPaper,
        }}
        anchor="left"
    >
        <div className={props.classes.toolbar} />
        {props.children}
    </Drawer>
);

export default withStyles(styles)(Sidebar);
