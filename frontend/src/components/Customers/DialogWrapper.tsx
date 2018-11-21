import { observer } from "mobx-react"
import * as React from "react";

import Button from '@material-ui/core/Button';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import { RootStore, withStore } from "../../store/store";

interface IProps {
    AddElement?: JSX.Element;
    classes: any;
    EditElement?: JSX.Element;
    handleCloseFn?: () => void;
    handleCloseObject: object;
    handleOpenFn?: () => void;
    showDialog?: boolean;
    store: RootStore;
    submitFn: () => Promise<any>;
    title: string;
}

interface IState {
    open: boolean;
}

class DialogWrapper extends React.Component<IProps, IState> {
    state: IState = { open: false };

    constructor(props: IProps) {
        super(props);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public render(): JSX.Element {
        return (
            <>
                <Dialog
                    open={this.isOpen()}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">{this.props.title}</DialogTitle>
                    <DialogContent>
                        {this.props.children}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Cancel</Button>
                        <Button onClick={this.handleSubmit} color="primary">{this.submitText()}</Button>
                    </DialogActions>
                </Dialog>
                {this.showAddElement()}
            </>
        );
    }

    private isOpen(): boolean {
        if (this.props.showDialog !== undefined) {
            return this.props.showDialog;
        }
        return this.state.open;
    }

    private submitText(): string {
        if (this.props.AddElement) {
            return "Create";
        } else if (this.props.EditElement) {
            return "Update";
        }
        return "Submit";
    }

    private showAddElement(): JSX.Element {
        if (!this.props.AddElement) {
            return <span />;
        }
        return (
            <span onClick={this.handleOpen} style={{display: "contents"}}>
                {this.props.AddElement}
            </span>
        );
    }

    private handleOpen() {
        this.setState({...this.state, open: true});
        if (this.props.handleOpenFn) {
            this.props.handleOpenFn()
        }
    }

    private handleClose() {
        this.setState({...this.state, open: false});
        if (this.props.handleCloseFn) {
            this.props.handleCloseFn()
        }
    }

    private handleSubmit() {
        this.props.submitFn().then(() =>
            this.setState({...this.state, open: false})
        );
    }
}

export default withStore(observer(DialogWrapper));
