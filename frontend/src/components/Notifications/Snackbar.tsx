import * as React from "react";
import classNames from "classnames";

import { withStyles, Theme } from '@material-ui/core/styles';
import amber from '@material-ui/core/colors/amber';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import green from '@material-ui/core/colors/green';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';

import { IMessage } from "../../store/messages";

interface IProps extends IMessage {
    key: string;
    classes: any;
}

const styles = (theme: Theme) => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.dark,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
  });

class MessageContent extends React.Component<IProps, {}> {
    private variantIcon = {
        success: CheckCircleIcon,
        warning: WarningIcon,
        error: ErrorIcon,
        info: InfoIcon,
    };

    public render(): JSX.Element {
        const { classes } = this.props;
        const Icon = this.variantIcon[this.props.messageType];

        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={this.props.isOpen}
                autoHideDuration={10000}
                onClose={this.props.handleClose}
            >
                <SnackbarContent
                    className={classes[this.props.messageType]}
                    aria-describedby="client-snackbar"
                    message={
                        <span id="client-snackbar" className={classes.message}>
                            <Icon className={classNames(classes.icon, classes.iconVariant)} />
                            {this.props.message}
                        </span>
                    }
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={classes.close}
                            onClick={this.props.handleClose}
                        >
                            <CloseIcon className={classes.icon} />
                        </IconButton>,
                    ]}
                />
            </Snackbar>
        );
    }
}

export const Message = withStyles(styles)(MessageContent);
