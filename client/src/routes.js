import React from "react";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import SignIn from "./components/SignIn";
import SignOut from "./components/SignOut";
import {
  CustomersContainer,
  InternalTransferContainer,
  PayAccClientContainer,
  PayAccStaffContainer,
  ContactsContainer
} from "./components/DashContainer";

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
    comp: props => <PayAccClientContainer {...props} />
  },
  {
    path: "/payment-accounts-staff",
    isPrivate: true,
    exact: true,
    comp: props => <PayAccStaffContainer {...props} />
  },
  {
    path: "/internal-transfers",
    isPrivate: true,
    exact: true,
    comp: props => <InternalTransferContainer {...props} />
  },
  {
    path: "/contacts",
    isPrivate: true,
    exact: true,
    comp: props => <ContactsContainer {...props} />
  },
  {
    path: "/somewhere-the-God-only-knows",
    isPrivate: false,
    exact: false,
    comp: props => <NotFound />
  },
  {
    path: "",
    isPrivate: false,
    exact: false,
    comp: props => <NotFound />
  }
];

export default routes;
