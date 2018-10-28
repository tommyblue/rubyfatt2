import { map } from "lodash";
import { observer } from "mobx-react"
import * as React from "react";

import { RootStore, withStore } from "../../store/store";
import { Message } from "./Snackbar";

interface IProps {
    store: RootStore;
}

class WrappedMessages extends React.Component<IProps, {}> {

    public render(): JSX.Element {
        return (
            <div>
                { map(this.props.store.messagesStore.messages, (message, index) => (
                    <Message key={`message_${index}`} {...message} />
                )) }
            </div>
        );
    }
}

export const Messages = withStore(observer(WrappedMessages));
