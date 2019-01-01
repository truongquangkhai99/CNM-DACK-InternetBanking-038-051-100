import React, { Component } from "react";
import axios from "axios";
import { Button } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import PayIn from "./PayIn";
import Message from "./Message";
import MustBeStaff from "./HOCs/MustBeStaff";

class PayAccStaff extends Component {
  state = {
    payAccs: [],
    // pay in panel
    payAccId: "",
    accNumber: "",
    clientName: "",
    clientEmail: "",
    currentBalance: 0,
    // for notify message
    isMessageOpen: false,
    messageType: "",
    message: "",
    // toggle pay in panel
    togglePayInPanel: false
  };

  getPayAccountsList = () => {
    axios
      .get("http://localhost:3001/pay-accs")
      .then(resp => {
        const { status, data: payAccs } = resp;
        if (status === 200) {
          this.setState({ payAccs });
        } else {
          this.setState({
            messageType: "error",
            isMessageOpen: true,
            message: "Failed getting payment accounts list"
          });
          throw new Error(
            "Something went wrong when  getting payment accounts list, status ",
            status
          );
        }
      })
      .catch(err => {
        this.setState({
          messageType: "error",
          isMessageOpen: true,
          message: "Failed getting payment accounts list"
        });
        console.log(err);
      });
  };

  componentDidMount = () => {
    this.getPayAccountsList();
  };

  onPayIn = (payAccId, accNumber, clientName, clientEmail, currentBalance) => {
    if (
      payAccId === undefined ||
      accNumber === undefined ||
      clientName === undefined ||
      clientEmail === undefined ||
      currentBalance === undefined
    )
      return this.setState({
        messageType: "error",
        isMessageOpen: true,
        message: "Could not get payment account identities"
      });

    this.setState({
      payAccId,
      accNumber,
      clientName,
      clientEmail,
      currentBalance,
      togglePayInPanel: true
    });
  };

  handleClosePayInPanel = () => {
    this.setState({ togglePayInPanel: false });
  };

  handlePayInSucceed = () => {
    this.getPayAccountsList();
  };

  handleCloseMessage = () => {
    this.setState({ isMessageOpen: false });
  };

  render() {
    const {
      payAccs,
      payAccId,
      accNumber,
      clientName,
      clientEmail,
      currentBalance,
      messageType,
      message,
      isMessageOpen,
      togglePayInPanel
    } = this.state;

    const data = payAccs.map((payAcc, index) => [
      index + 1,
      payAcc.accNumber,
      payAcc.clientName,
      payAcc.clientEmail,
      payAcc.balance,
      payAcc.createdAt,
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          this.onPayIn(
            payAcc.id,
            payAcc.accNumber,
            payAcc.clientName,
            payAcc.clientEmail,
            payAcc.balance
          )
        }
      >
        pay in
      </Button>
    ]);

    const columns = [
      "#",
      "Number",
      "Name",
      "Email",
      "Balance",
      "Created at",
      "Action"
    ];

    const options = {
      selectableRows: false,
      responsive: "scroll",
      print: false,
      download: false,
      viewColumns: false,
      filter: false
    };

    return (
      <React.Fragment>
        {togglePayInPanel === true && (
          <PayIn
            payAccId={payAccId}
            accNumber={accNumber}
            clientName={clientName}
            clientEmail={clientEmail}
            currentBalance={currentBalance}
            onPayInSucceed={this.handlePayInSucceed}
            onClosePayInPanel={this.handleClosePayInPanel}
          />
        )}

        <MUIDataTable
          title={"Payment accounts list"}
          data={data}
          columns={columns}
          options={options}
        />

        <Message
          variant={messageType}
          message={message}
          open={isMessageOpen}
          onClose={this.handleCloseMessage}
        />
      </React.Fragment>
    );
  }
}

export default MustBeStaff(PayAccStaff);
