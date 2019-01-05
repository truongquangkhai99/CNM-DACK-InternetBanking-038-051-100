import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import PayIn from "./PayIn";
import Message from "./Message";
import MustBeStaff from "./HOCs/MustBeStaff";
import * as payAccStaffActions from "../redux/actions/payAccStaffActions";
import * as messageActions from "../redux/actions/messageActions";

class PayAccStaff extends Component {
  componentDidMount = () => {
    this.props.getPayAccsList();
  };

  onPayInSucceed = amount => {
    this.props.handlePayInSucceed(+this.props.currentBalance + +amount);
    this.props.getPayAccsList();
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
    } = this.props;

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
          this.props.openPayInPanel(
            payAcc.id,
            payAcc.accNumber,
            payAcc.clientName,
            payAcc.clientEmail,
            payAcc.balance
          )
        }
        disabled={payAcc.status === "CLOSED"}
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
            onPayInSucceed={this.onPayInSucceed}
            onClosePayInPanel={this.props.closePayInPanel}
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
          onClose={this.props.closeMessage}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  ...state.payAccStaff
});

const mapDispatchToProps = dispatch => ({
  getPayAccsList: () => dispatch(payAccStaffActions.getPayAccsList()),
  openPayInPanel: (id, accNumber, clientName, clientEmail, balance) =>
    dispatch(
      payAccStaffActions.openPayInPanel(
        id,
        accNumber,
        clientName,
        clientEmail,
        balance
      )
    ),
  closePayInPanel: () => dispatch(payAccStaffActions.closePayInPanel()),
  handlePayInSucceed: amount =>
    dispatch(payAccStaffActions.handlePayInSucceed(amount)),
  closeMessage: () => dispatch(messageActions.closeMessage())
});

export default MustBeStaff(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PayAccStaff)
);
