import React, { Component } from "react";
import axios from "axios";
import {
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import Message from "./Message";
import { getUserInfo } from "../utils/authHelper";
import MustBeCustomer from "./HOCs/MustBeCustomer";

class PayAccClient extends Component {
  state = {
    payAccs: [],
    histories: [],
    // pay in panel
    payAccId: "",
    accNumber: "",
    currentBalance: 0,
    // for dialog confirming closing payment account
    isDialogClosePayAccOpen: false,
    // for dialog viewing payment account history
    isDialogHistoryPayAccOpen: false,
    // transfer remaining balance of closing payment account to current customer's another one
    transferAccId: "",
    // for notify message
    isMessageOpen: false,
    messageType: "",
    message: ""
  };

  getPayAccsList = () => {
    const customerId = getUserInfo("f_id");

    if (customerId === null)
      return this.setState({
        messageType: "error",
        isMessageOpen: true,
        message: "Sorry, could not get user entity, please sign in again"
      });

    axios
      .get(`http://localhost:3001/pay-accs/${customerId}`)
      .then(resp => {
        const { status, data: payAccs } = resp;
        if (status === 200) {
          this.setState({ payAccs });
        } else {
          this.setState({
            messageType: "error",
            isMessageOpen: true,
            message: "Sorry, failed getting your payment accounts list"
          });
          throw new Error(
            "Something went wrong when getting payment accounts list, status ",
            status
          );
        }
      })
      .catch(err => {
        this.setState({
          messageType: "error",
          isMessageOpen: true,
          message: "Sorry, failed getting your payment accounts list"
        });
        console.log(err);
      });
  };

  componentDidMount = () => {
    this.getPayAccsList();
  };

  onClosePayAcc = (payAccId, accNumber, currentBalance) => {
    if (
      payAccId === undefined ||
      accNumber === undefined ||
      currentBalance === undefined ||
      isNaN(currentBalance)
    )
      return this.setState({
        messageType: "error",
        isMessageOpen: true,
        message: "Sorry, could not get this payment account information"
      });
    this.setState({
      payAccId,
      accNumber,
      currentBalance,
      isDialogClosePayAccOpen: true
    });
  };

  handleInputChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleCloseClosePayAccDialog = () => {
    this.setState({ isDialogClosePayAccOpen: false, transferAccId: "" });
  };

  handleClosePayAcc = (payAccId, accNumber) => {
    // assume the desired payment account was closed successfully
    // with its remaining balance already had been transferred to another one
    this.setState(
      {
        messageType: "success",
        isMessageOpen: true,
        message: `Successfully close payment account #${accNumber}`,
        payAccId: "",
        isDialogClosePayAccOpen: false
      },
      // reset accNumber then refresh payment accounts list
      () => {
        this.setState({ accNumber: "" }, this.getPayAccsList);
      }
    );
  };

  handleViewHistory = (payAccId, accNumber) => {
    if (payAccId === undefined || accNumber === undefined)
      return this.setState({
        messageType: "error",
        isMessageOpen: true,
        message: "Sorry, failed getting this payment account information"
      });

    axios
      .get(`http://localhost:3001/histories/${payAccId}`)
      .then(resp => {
        const { status, data: histories } = resp;
        if (status === 200) {
          this.setState({
            histories,
            isDialogHistoryPayAccOpen: true,
            accNumber
          });
        } else {
          this.setState({
            messageType: "error",
            isMessageOpen: true,
            message: `Sorry, failed getting history of payment account #${accNumber}`
          });
          throw new Error(
            "Something went wrong getting history of payment account, status ",
            status
          );
        }
      })
      .catch(err => {
        this.setState({
          messageType: "error",
          isMessageOpen: true,
          message: `Sorry, failed getting history of payment account #${accNumber}`
        });
        console.log(err);
      });
  };

  handleCloseHistoryPayAccDialog = () => {
    this.setState({
      isDialogHistoryPayAccOpen: false,
      payAccId: "",
      accNumber: ""
    });
  };

  handleCloseMessage = () => {
    this.setState({ isMessageOpen: false });
  };

  render() {
    const {
      payAccs,
      histories,
      payAccId,
      accNumber,
      currentBalance,
      transferAccId,
      transferredAccNumber,
      isDialogClosePayAccOpen,
      isDialogHistoryPayAccOpen,
      messageType,
      message,
      isMessageOpen
    } = this.state;

    const MUIDataTableInfo = {
      default: {
        data: payAccs.map((payAcc, index) => {
          const { id, accNumber, balance, createdAt } = payAcc;
          return [
            index + 1,
            accNumber,
            balance,
            createdAt,
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.handleViewHistory(id, accNumber)}
              >
                history
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => this.onClosePayAcc(id, accNumber, balance)}
                style={{ marginLeft: "10px" }}
              >
                close
              </Button>
            </div>
          ];
        }),
        columns: ["#", "Number", "Balance", "Created at", "Action"],
        options: {
          selectableRows: false,
          responsive: "scroll",
          print: false,
          download: false,
          viewColumns: false,
          filter: false
        }
      },
      closePayAcc: {
        data: payAccs
          .filter(payAcc => payAcc.id !== payAccId)
          .map((payAcc, index) => {
            const { id, accNumber, balance } = payAcc;
            return [
              <RadioGroup
                name="transferAccId"
                value={transferAccId}
                onChange={this.handleInputChange}
              >
                <FormControlLabel
                  value={id}
                  control={
                    <Radio
                      color="primary"
                      checked={
                        (transferAccId === "" && index === 0) ||
                        id === transferAccId
                      }
                    />
                  }
                  label=""
                />
              </RadioGroup>,
              accNumber,
              balance
            ];
          }),
        columns: ["Select", "Number", "Balance"],
        options: {
          selectableRows: false,
          responsive: "scroll",
          print: false,
          download: false,
          viewColumns: false,
          filter: false,
          rowsPerPage: 5,
          rowsPerPageOptions: [5, 10, 15]
        }
      },
      payAccHistory: {
        data: histories.map((history, index) => {
          const { toAccNumber, amount, feeType, createdAt } = history;
          return [
            index + 1,
            toAccNumber,
            amount,
            +feeType === 1 ? "Sender" : "Receiver",
            createdAt
          ];
        }),
        columns: [
          "#",
          "Receiver account number",
          "Amount",
          "Fee type",
          "Date time"
        ],
        options: {
          selectableRows: false,
          responsive: "scroll",
          print: false,
          download: false,
          viewColumns: false,
          filter: false,
          rowsPerPage: 5,
          rowsPerPageOptions: [5, 10]
        }
      }
    };

    return (
      <React.Fragment>
        <MUIDataTable
          title={"Payment accounts list"}
          data={MUIDataTableInfo.default.data}
          columns={MUIDataTableInfo.default.columns}
          options={MUIDataTableInfo.default.options}
        />

        {/* dialog to confirm closing payment account */}
        <Dialog
          open={isDialogClosePayAccOpen}
          onClose={this.handleCloseClosePayAccDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Are you sure to close the payment account #${accNumber}?`}
          </DialogTitle>
          <DialogContent
            style={{ width: "600px", height: "auto", maxHeight: "1000px" }}
          >
            {currentBalance > 0 ? (
              <React.Fragment>
                <span>Balance of this payment account is {currentBalance}</span>
                <br />
                <span>
                  Please choose one of the following payment accounts to inherit
                  the remaining
                </span>
                <p />
                <MUIDataTable
                  title={"Payment accounts list"}
                  data={MUIDataTableInfo.closePayAcc.data}
                  columns={MUIDataTableInfo.closePayAcc.columns}
                  options={MUIDataTableInfo.closePayAcc.options}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <span>Balance of this payment account is 0</span>
                <br />
                <span>No further action required</span>
              </React.Fragment>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseClosePayAccDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() =>
                this.handleClosePayAcc(
                  payAccId,
                  accNumber,
                  currentBalance,
                  transferredAccNumber
                )
              }
              color="primary"
              autoFocus
            >
              Yes, I'm sure
            </Button>
          </DialogActions>
        </Dialog>

        {/* dialog to view selected payment account history */}
        <Dialog
          open={isDialogHistoryPayAccOpen}
          onClose={this.handleCloseHistoryPayAccDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth={"md"}
        >
          <DialogContent>
            <MUIDataTable
              title={`Recent activities of payment account #${accNumber}`}
              data={MUIDataTableInfo.payAccHistory.data}
              columns={MUIDataTableInfo.payAccHistory.columns}
              options={MUIDataTableInfo.payAccHistory.options}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleCloseHistoryPayAccDialog}
              color="primary"
              autoFocus
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

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

export default MustBeCustomer(PayAccClient);
