import React, { Component } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import MUIDataTable from "mui-datatables";
import Dashboard from "./Dashboard";
import Message from "./Message";
import CreateAccount from "./CreateAccount";

class Customers extends Component {
  state = {
    customers: [],
    // for notify message
    isMessageOpen: false,
    messageType: "",
    message: "",
    // for dialog confirm creating new payment account
    isDialogOpen: false,
    customerId: "",
    clientEmail: "",
    clientName: "",
    // for dialog notify about newly created payment account number
    isDialogPayAccOpen: false,
    payAccNumber: ""
  };

  getCustomersList = () => {
    axios
      .get("http://localhost:3001/customers")
      .then(resp => {
        const { status, data: customers } = resp;
        if (status === 200) {
          this.setState({
            customers
          });
        } else {
          this.setState({
            messageType: "error",
            isMessageOpen: true,
            message: "Failed getting customers list."
          });
          throw new Error(
            "Something wrong while getting customers list, status ",
            status
          );
        }
      })
      .catch(err => {
        this.setState({
          messageType: "error",
          isMessageOpen: true,
          message: "Failed getting customers list"
        });
        console.log(err);
      });
  };

  componentDidMount = () => {
    this.getCustomersList();
  };

  onCreatePayAcc = (customerId, clientEmail, clientName) => {
    if (customerId === "" || clientEmail === "" || clientName === "")
      return this.setState({
        messageType: "error",
        isMessageOpen: true,
        message: "Could not get customer identities, try again later"
      });
    this.setState({ isDialogOpen: true, customerId, clientEmail, clientName });
  };

  handleCreatePayAcc = () => {
    const { customerId, clientEmail, clientName } = this.state;
    axios
      .post("http://localhost:3001/pay-acc", {
        customerId,
        clientEmail,
        clientName
      })
      .then(resp => {
        const {
          status,
          data: { accNumber }
        } = resp;
        if (status === 201) {
          this.setState({
            isDialogOpen: false,
            customerId: "",
            clientEmail: "",
            clientName: "",
            isDialogPayAccOpen: true,
            payAccNumber: accNumber
          });
        } else {
          this.setState({
            isDialogOpen: false,
            customerId: "",
            clientEmail: "",
            clientName: "",
            messageType: "error",
            isMessageOpen: true,
            message: "Failed creating payment account"
          });
          throw new Error(
            "Something wrong while creating payment account, status ",
            status
          );
        }
      })
      .catch(err => {
        this.setState({
          isDialogOpen: false,
          customerId: "",
          clientEmail: "",
          clientName: "",
          messageType: "error",
          isMessageOpen: true,
          message: "Failed creating payment account"
        });
        console.log(err);
      });
  };

  handleCloseDialog = () => {
    this.setState({
      isDialogOpen: false,
      customerId: "",
      clientEmail: "",
      clientName: ""
    });
  };

  handleCloseMessage = () => {
    this.setState({ isMessageOpen: false });
  };

  handleCreateAccountSucceed = () => {
    this.getCustomersList();
  };

  handleCloseDialogPayAcc = () => {
    this.setState({ isDialogPayAccOpen: false, payAccNumber: "" });
  };

  render() {
    const {
      customers,
      isMessageOpen,
      messageType,
      message,
      isDialogOpen,
      isDialogPayAccOpen,
      payAccNumber
    } = this.state;

    const data = customers.map((customer, index) => [
      index + 1,
      customer.email,
      customer.name,
      customer.phone,
      customer.createdAt,
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          this.onCreatePayAcc(
            customer.customerId,
            customer.email,
            customer.name
          )
        }
      >
        create payment account
      </Button>
    ]);

    const columns = ["#", "Email", "Name", "Phone", "Created at", "Action"];

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
        <CreateAccount
          onCreateAccountSucceed={this.handleCreateAccountSucceed}
        />

        <MUIDataTable
          title={"Customers list"}
          data={data}
          columns={columns}
          options={options}
        />

        {/* dialog confirm creating new payment account */}
        <Dialog
          open={isDialogOpen}
          onClose={this.handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Create new payment account for this customer?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <span>The balance of new payment account is 0 by default</span>
              <br />
              <span>It may need paying in afterward</span>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleCreatePayAcc} color="primary" autoFocus>
              Create
            </Button>
          </DialogActions>
        </Dialog>

        {/* dialog notify newly created payment account number */}
        <Dialog
          open={isDialogPayAccOpen}
          onClose={this.handleCloseDialogPayAcc}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"New payment account successfully created"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <span>
                Account number: <b>{payAccNumber}</b>
              </span>
              <br />
              <span>Balance: 0 (default)</span>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleCloseDialogPayAcc}
              color="primary"
              autoFocus
            >
              Confirm
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

// export default class CustomersContainer extends Component {
//   render() {
//     return <Dashboard screen={<Customers />} />;
//   }
// }

export default Customers

