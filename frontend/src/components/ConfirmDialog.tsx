import{ isEmpty } from "lodash";
import * as React from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

interface IProps {
    cancelText?: string;
    confirmText?: string;
    handleCancel: () => void;
    handleClose?: () => void;
    handleConfirm: () => void;
    open: boolean;
    text?: string;
    title?: string;
}

export default class extends React.Component<IProps, {}> {
    public render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{this.props.title || "Confirm?"}</DialogTitle>
                {this.getText()}
                <DialogActions>
                    <Button onClick={this.props.handleCancel} color="primary">
                        {this.props.cancelText || "Cancel"}
                    </Button>
                    <Button onClick={this.props.handleConfirm} color="primary" autoFocus>
                        {this.props.confirmText || "Ok"}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    private getText(): JSX.Element | void {
        if (isEmpty(this.props.text)) {
            return;
        }
        return (
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {this.props.text}
                </DialogContentText>
            </DialogContent>
        );
    }
}
