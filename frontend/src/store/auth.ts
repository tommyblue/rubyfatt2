import { observable } from "mobx";
import { isEmpty } from "lodash";

import { RootStore } from "./store";
import { MessageTypes } from "./messages";

export class AuthStore {
    rootStore: RootStore = null;

    @observable authToken: string | null = null;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    public authenticate(email: string, password: string): void {
        if (isEmpty(email) || isEmpty(password)) {
            this.rootStore.messagesStore.createMessage(
                "Please fill in the form",
                MessageTypes.WARNING,
            )
            return
        }
        fetch("/api/session/sign_in", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password}),
        }).then(
            response => {
                if (!response.ok) {
                    return console.log(response.statusText);
                }
                return response.json().then(jsonResp => console.log(jsonResp.data));
            }
        );
    }
}
