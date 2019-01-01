import React, { Component } from "react";
import Dashboard from "./Dashboard";
import Customers from "./Customers";
import InternalTransfer from "./InternalTransfer";
import PayAccClient from "./PayAccClient";
import PayAccStaff from "./PayAccStaff";

export class CustomersContainer extends Component {
  render() {
    return <Dashboard screen={<Customers />} title="Customers" />;
  }
}

export class InternalTransferContainer extends Component {
  render() {
    return (
      <Dashboard screen={<InternalTransfer />} title="Internal Transfer" />
    );
  }
}

export class PayAccClientContainer extends Component {
  render() {
    return <Dashboard screen={<PayAccClient />} title="Payment Accounts" />;
  }
}

export class PayAccStaffContainer extends Component {
  render() {
    return <Dashboard screen={<PayAccStaff />} title="Payment Accounts" />;
  }
}
