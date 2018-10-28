import { observable } from "mobx";

import { RootStore } from "./store";

export enum MessageTypes {
    SUCCESS = 'success',
    WARNING = 'warning',
    ERROR = 'error',
    INFO = 'info',
}

export interface IMessage {
    isOpen: boolean;
    messageType: MessageTypes;
    message: string;
    handleClose: () => void;
}

export class MessagesStore {
    rootStore: RootStore = null;

    @observable messages: IMessage[] = [];

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    public createMessage(message: string, messageType: MessageTypes) {
        // Remove all but 1 and deactivate it
        if (this.messages.length > 0) {
            this.messages = [this.messages[this.messages.length - 1]];
            this.messages[0].isOpen = false;
        }


        this.messages.push({
            isOpen: true,
            messageType,
            message,
            handleClose: this.handleClose.bind(this),
        });
    }

    private handleClose() {
        this.messages.forEach(message => (message.isOpen = false));
    }
}
