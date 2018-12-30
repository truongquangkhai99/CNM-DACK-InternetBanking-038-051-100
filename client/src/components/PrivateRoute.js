import React from "react";
import { Route, Redirect } from "react-router-dom";
import authHelper from "../ultils/authHelper";

const PrivateRoute = ({ component: Comp, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        authHelper.checkAuth() ? (
          <Comp {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/sign-in", state: { from: props.location } }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
