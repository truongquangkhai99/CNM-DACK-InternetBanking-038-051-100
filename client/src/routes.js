import React from "react";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Signin from "./components/Signin";
import Signup from "./components/Signup";

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
    comp: props => <Signin {...props} />
  },
  {
    path: "/sign-up",
    isPrivate: false,
    exact: false,
    comp: props => <Signup {...props} />
  },
  {
    path: "",
    isPrivate: false,
    exact: false,
    comp: props => <NotFound />
  }
];

export default routes;
