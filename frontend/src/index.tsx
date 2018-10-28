import { HashRouter, Switch, Route } from "react-router-dom";
import * as React from "react";
import * as ReactDOM from "react-dom";

import 'typeface-roboto';

import { Messages } from "./components/Notifications/Messages";
import { PrivateRoute } from "./components/PrivateRoute";
import { RootStore, Provider } from "./store/store";
import Customers from "./containers/Customers";
import Login from "./containers/Login";

export const drawerWidth = 300;

const Router = () => (
    <HashRouter>
        <Switch>
            <Route path='/login' component={Login} />
            <PrivateRoute path='/customers' component={Customers}/>
            <PrivateRoute path='/' component={Customers}/>
        </Switch>
    </HashRouter>
);

const App = () => (
    <div style={{display: "flex"}}>
        <Messages />
        <Router />
    </div>
);

ReactDOM.render(
    <Provider value={new RootStore()}><App /></Provider>,
    document.getElementById("app")
);
