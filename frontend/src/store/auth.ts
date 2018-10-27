import { observable } from "mobx";

import { RootStore } from "./store";

export class AuthStore {
    rootStore: RootStore = null;

    @observable authToken: string | null = null;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    public authenticate(email: string, password: string): void {
        console.log("auth!")
        this.authToken = "pippo";
    }
}
