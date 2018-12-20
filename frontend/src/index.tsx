import { HashRouter, Switch, Route } from "react-router-dom";
import * as React from "react";
import * as ReactDOM from "react-dom";

import 'typeface-roboto';

import { Messages } from "./components/Notifications/Messages";
import { PrivateRoute } from "./components/PrivateRoute";
import { RootStore, Provider } from "./store/store";
import Customers from "./containers/Customers";
import Dashboard from "./containers/Dashboard";
import Login from "./containers/Login";
import UserProfile from "./containers/UserProfile";

export const drawerWidth = 300;

const Router = () => (
    <HashRouter>
        <Switch>
            <Route path='/login' component={Login} />
            <PrivateRoute path='/customers/:id' component={Customers}/>
            <PrivateRoute path='/customers' component={Customers}/>
            <PrivateRoute path='/profile' component={UserProfile}/>
            <PrivateRoute path='/' component={Dashboard}/>
        </Switch>
    </HashRouter>
);

const App = () => (
    <React.Fragment>
        <Messages />
        <Router />
    </React.Fragment>
);

ReactDOM.render(
    <Provider value={new RootStore()}><App /></Provider>,
    document.getElementById("app")
);
