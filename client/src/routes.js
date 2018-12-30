import React from "react";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

const routes = [
  {
    path: "/",
    isPrivate: true,
    exact: true,
    comp: props => <Home {...props} />
  },
  {
    path: "/sign-in",
    isPrivate: false,
    exact: false,
    comp: props => <SignIn {...props} />
  },
  {
    path: "/sign-up",
    isPrivate: false,
    exact: false,
    comp: props => <SignUp {...props} />
  },
  {
    path: "",
    isPrivate: false,
    exact: false,
    comp: props => <NotFound />
  }
];

export default routes;
