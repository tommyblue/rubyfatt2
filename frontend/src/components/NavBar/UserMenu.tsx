import * as React from "react";
import { Link } from "react-router-dom";

import { withStyles, Theme } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const styles = (theme: Theme) => ({
    link: {
        textDecoration: "none",
        color: theme.palette.text.primary
    }
});

interface IProps {
    show: boolean;
    classes: any;
}

interface IState {
    anchorEl: HTMLElement | null;
}

class UserProfile extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.handleMenu = this.handleMenu.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {anchorEl: null};
    }

    render(): JSX.Element {
        const { anchorEl } = this.state;
        const { classes } = this.props;
        const open = Boolean(anchorEl);

        return (
            <div>
                <IconButton
                    aria-owns={open ? 'menu-appbar' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleMenu}
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={open}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.handleClose}>
                        <Link to="/profile" className={classes.link}>Profile</Link>
                    </MenuItem>
                    <MenuItem onClick={this.handleClose}>
                        <Link to="/password_update" className={classes.link}>Change Password</Link>
                    </MenuItem>
                </Menu>
            </div>
        );
    }

    private handleMenu(event: React.MouseEvent<HTMLElement>) {
        this.setState({ anchorEl: event.currentTarget });
    };

    private handleClose() {
        this.setState({ anchorEl: null });
    };
}

export default withStyles(styles)(UserProfile);
