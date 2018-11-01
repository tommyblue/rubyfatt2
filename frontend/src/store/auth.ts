import { isEmpty } from "lodash";
import { computed, observable } from "mobx";
import Cookies from "universal-cookie";

import { RootStore } from "./store";
import { MessageTypes } from "./messages";

interface IAuthResponse {
    data: {
        token: string;
    }
}

export class AuthStore {
    rootStore: RootStore = null;

    @observable authToken: string | null = null;
    cookie_name = "auth_token";

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;

        this.checkCookie();
    }

    @computed public get isAuthenticated(): boolean {
        return this.authToken !== null;
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
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password}),
        }).then(
            (response: any) => {
                if (!response.ok) {
                    return console.warn(response.statusText);
                }
                return response.json().then(
                    (jsonResp: IAuthResponse) => {
                        this.setAuthToken(jsonResp.data.token);
                        this.authToken = jsonResp.data.token;
                    }
                );
            }
        );
    }

    public signOut(): void {
        this.removeAuthToken();
        this.authToken = null;
    }

    public authFetch(url: string, method: string = "GET", body: any = {}, headers: HeadersInit = {}): Promise<Response> {
        const requestInit:RequestInit = {
            method,
            headers: {
                ...headers,
                ...{
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                'Authorization': `Bearer ${this.authToken}`
            },
        };
        if (!isEmpty(body) && method !== "GET") {
            requestInit.body = JSON.stringify(body);
        }
        return fetch(url, requestInit)
    };

    private setAuthToken(token: string): void {
        const cookies = new Cookies();
        cookies.set(this.cookie_name, token, {
            path: "/"
        });
    };

    private removeAuthToken(): void {
        const cookies = new Cookies();
        cookies.remove(this.cookie_name, {
            path: "/",
        });
    }

    // Load cookie if it exists and set authToken
    private checkCookie(): void {
        const cookies = new Cookies();
        const cookie = cookies.get(this.cookie_name)
       if (cookie) {
           this.authToken = cookie;
       }
    }
}
