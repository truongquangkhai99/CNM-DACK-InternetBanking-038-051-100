import React, {Component}  from "react";
import Customers from "./Customers"
import InternalTransfer from "./InternalTransfer"
import Dashboard from "./Dashboard"

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