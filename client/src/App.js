import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline"; // normalize.css
import PrivateRoute from "./components/PrivateRoute";
import routes from "./routes";
// import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  render() {
    const screens = routes.map(({ path, isPrivate, exact, comp }, index) =>
      isPrivate === true ? (
        <PrivateRoute key={index} path={path} exact={exact} component={comp} />
      ) : (
        <Route key={index} path={path} exact={exact} component={comp} />
      )
    );

    return (
      <BrowserRouter>
        <div>
          <CssBaseline />
          <Switch>{screens}</Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
