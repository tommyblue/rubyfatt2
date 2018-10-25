import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter, Switch, Route } from "react-router-dom";

import Customers from "./components/Customers";
import Login from "./components/Login";
import { PrivateRoute } from "./components/PrivateRoute";
import { RootStore, Provider } from "./store";

const App = () => (
    <HashRouter>
        <Switch>
            <Route path='/login' component={Login} />
            <PrivateRoute path='/customers' component={Customers}/>
            <PrivateRoute path='/' component={Customers}/>
        </Switch>
    </HashRouter>
);

ReactDOM.render(
    <Provider value={new RootStore()}><App /></Provider>,
    document.getElementById("app")
);
