import React from "react";
import { Route, Redirect } from "react-router-dom";
import { checkAuth } from "../utils/authHelper";

const PrivateRoute = ({ component: Comp, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        checkAuth() ? (
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
