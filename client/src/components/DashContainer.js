import React, { Component } from "react";
import Dashboard from "./Dashboard";
import Customers from "./Customers";
import InternalTransfer from "./InternalTransfer";
import PayAcc from "./PayAcc"

export class CustomersContainer extends Component {
  render() {
    return <Dashboard screen={<Customers />} />;
  }
}

export class InternalTransferContainer extends Component {
  render() {
    return <Dashboard screen={<InternalTransfer />} />;
  }
}

export class PayAccContainer extends Component {
    render() {
      return <Dashboard screen={<PayAcc />} />;
    }
  }
