import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import Message from "./Message";
import CreateAccount from "./CreateAccount";
import MustBeStaff from "./HOCs/MustBeStaff";
import * as customersActions from "../redux/actions/customersActions";
import * as messageActions from "../redux/actions/messageActions";

class Customers extends Component {
  componentDidMount = () => {
    this.props.getCustomersList();
  };

  render() {
    const {
      customers,
      isMessageOpen,
      messageType,
      message,
      customerId,
      clientEmail,
      clientName,
      isCreatePayAccDialogConfirmOpen,
      isCreatePayAccDialogOperatedOpen,
      payAccNumber
    } = this.props;

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
          this.props.openCreatePayAccConfirmDialog(
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
        <CreateAccount onCreateAccountSucceed={this.props.getCustomersList} />

        <MUIDataTable
          title={"Customers list"}
          data={data}
          columns={columns}
          options={options}
        />

        {/* dialog to confirm creating new payment account */}
        <Dialog
          open={isCreatePayAccDialogConfirmOpen}
          onClose={this.props.closeCreatePayAccConfirmDialog}
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
            <Button
              onClick={this.props.closeCreatePayAccConfirmDialog}
              color="primary"
            >
              cancel
            </Button>
            <Button
              onClick={() =>
                this.props.handleCreatePayAcc(
                  customerId,
                  clientEmail,
                  clientName
                )
              }
              color="primary"
              autoFocus
            >
              create
            </Button>
          </DialogActions>
        </Dialog>

        {/* dialog to notify newly created payment account number */}
        <Dialog
          open={isCreatePayAccDialogOperatedOpen}
          onClose={this.props.closeCreatePayAccOperatedDialog}
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
              onClick={this.props.closeCreatePayAccOperatedDialog}
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
          onClose={this.props.closeMessage}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  ...state.customers
});

const mapDispatchToProps = dispatch => ({
  getCustomersList: () => dispatch(customersActions.getCustomersList()),
  handleCreatePayAcc: (customerId, clientEmail, clientName) =>
    dispatch(
      customersActions.handleCreatePayAcc(customerId, clientEmail, clientName)
    ),
  openCreatePayAccConfirmDialog: (customerId, clientEmail, clientName) =>
    dispatch(
      customersActions.openCreatePayAccConfirmDialog(
        customerId,
        clientEmail,
        clientName
      )
    ),
  closeCreatePayAccConfirmDialog: () =>
    dispatch(customersActions.closeCreatePayAccConfirmDialog()),
  closeCreatePayAccOperatedDialog: () =>
    dispatch(customersActions.closeCreatePayAccOperatedDialog()),
  closeMessage: () => dispatch(messageActions.closeMessage())
});

export default MustBeStaff(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Customers)
);
