import React from "react";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import SignIn from "./components/SignIn";
import SignOut from "./components/SignOut";
// import SignUp from "./components/SignUp";
// import CustomersContainer from "./components/Customers";
import PayAccContainer from "./components/PayAcc";
import {CustomersContainer, InternalTransferContainer} from "./components/DashContainer";
// import InternalTransferContainer from "./components/InternalTransfer";

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
    path: "/sign-out",
    isPrivate: false,
    exact: false,
    comp: props => <SignOut />
  },
  // {
  //   path: "/sign-up",
  //   isPrivate: false,
  //   exact: false,
  //   comp: props => <SignUp {...props} />
  // },
  {
    path: "/customers",
    isPrivate: true,
    exact: true,
    comp: props => <CustomersContainer {...props} />
  },
  {
    path: "/payment-accounts",
    isPrivate: true,
    exact: true,
    comp: props => <PayAccContainer {...props} />
  },
  {
    path: "/internal-transfers",
    isPrivate: true,
    exact: true,
    comp: props => <InternalTransferContainer {...props} />
  },
  {
    path: "",
    isPrivate: false,
    exact: false,
    comp: props => <NotFound />
  }
];

export default routes;
