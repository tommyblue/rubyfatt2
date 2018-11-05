import { observer } from "mobx-react"
import * as React from "react";

import Button from '@material-ui/core/Button';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import { RootStore, withStore } from "../../store/store";

interface IProps {
    store: RootStore;
    classes: any;
    handleCloseObject: object;
    AddElement: JSX.Element;
    title: string;
    createFn: () => Promise<any>;
}

interface IState {
    open: boolean;
}

class NewWrapper extends React.Component<IProps, IState> {
    state: IState = { open: false};

    constructor(props: IProps) {
        super(props);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
    }

    public render(): JSX.Element {
        return (
            <>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">{this.props.title}</DialogTitle>
                    <DialogContent>
                        {this.props.children}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Cancel</Button>
                        <Button onClick={this.handleCreate} color="primary">Create</Button>
                    </DialogActions>
                </Dialog>
                <span onClick={this.handleOpen} style={{display: "contents"}}>
                    {this.props.AddElement}
                </span>
            </>
        );
    }

    private handleOpen() {
        this.setState({...this.state, open: true});
    }

    private handleClose() {
        this.setState({...this.state, ...this.props.handleCloseObject, open: false});
    }

    private handleCreate() {
        this.props.createFn().then(() =>
            this.setState({...this.state, open: false})
        );
    }
}

export default withStore(observer(NewWrapper));
