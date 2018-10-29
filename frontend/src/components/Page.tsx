import * as React from "react";

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";

const styles = (theme: any) => ({
    root: {
        display: 'flex',
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing.unit * 3,
    },
    toolbar: theme.mixins.toolbar,
});

interface IProps {
    classes: any;
    children: JSX.Element;
    sidebarContent?: JSX.Element;
}

const getSidebar = (sidebarContent?: JSX.Element) => {
    if (sidebarContent) {
        return <Sidebar>{sidebarContent}</Sidebar>;
    }
    return <span />;
}

const Page = (props: IProps) => (
    <div className={props.classes.root}>
        <CssBaseline />
        <NavBar />
        {getSidebar(props.sidebarContent)}
        <main className={props.classes.content}>
            <div className={props.classes.toolbar} />
            {props.children}
        </main>
    </div>
);

export default withStyles(styles)(Page);
