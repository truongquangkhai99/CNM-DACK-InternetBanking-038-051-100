import React, { Component } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography
} from "@material-ui/core";
import Message from "./Message";
import MustBeCustomer from "./HOCs/MustBeCustomer";
import { getUserInfo } from "../utils/authHelper";

class InternalTransfer extends Component {
  state = {
    payAccs: [],
    payAccId: "",
    currentBalance: 0,
    // for notify message
    isMessageOpen: false,
    messageType: "",
    message: "",
    destPayAccNumber: "",
    destName: "",
    destEmail: "",
    destPhone: "",
    transferAmount: "",
    transferAmountWarning: false,
    transferMsg: "",
    feePaymentType: "transferer",
    isDialogOTPOpen: false,
    OTP: ""
  };

  componentDidMount = () => {
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
        if (status === 200 && payAccs.length > 0) {
          // default selected payment account
          this.setState({
            payAccs,
            payAccId: payAccs[0].id,
            accNumber: payAccs[0].accNumber,
            currentBalance: payAccs[0].balance
          });
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

  handleInputChange = e => {
    const { name, value } = e.target;
    if (name === "payAccId")
      return this.setState({
        [name]: value,
        currentBalance: this.state.payAccs.find(payAcc => payAcc.id === value)
          .balance
      });

    if (name === "transferAmount")
      if (+value > +this.state.currentBalance)
        return this.setState({ transferAmountWarning: true, [name]: value });
      else
        return this.setState({ transferAmountWarning: false, [name]: value });

    this.setState({ [name]: value });
  };

  handleCloseMessage = () => {
    this.setState({ isMessageOpen: false });
  };

  handleCloseOTPDialog = () => {
    this.setState({ isDialogOTPOpen: false });
  };

  handleSendOTP = () => {};

  handleOpenOTPDialog = () => {
    const {
      payAccId,
      destPayAccNumber,
      transferAmount,
      transferMsg
    } = this.state;

    if (payAccId === "" || destPayAccNumber === "" || transferMsg === "")
      return this.setState({
        messageType: "warning",
        isMessageOpen: true,
        message: "Please check if any required field were empty"
      });

    if (transferAmount < 1)
      return this.setState({
        messageType: "warning",
        isMessageOpen: true,
        message: "The amount must be greater than 0"
      });

    this.setState({ isDialogOTPOpen: true });
  };

  handleTransfer = () => {
    const { OTP } = this.state;

    if (OTP === "")
      return this.setState({
        messageType: "warning",
        isMessageOpen: true,
        message: "Please check if OTP were not entered"
      });

    console.log(OTP);

    // close dialog
    this.setState({ isDialogOTPOpen: false });
  };

  render() {
    const {
      payAccs,
      payAccId,
      accNumber,
      currentBalance,
      transferAmountWarning,
      destName,
      destEmail,
      destPhone,
      destPayAccNumber,
      isMessageOpen,
      messageType,
      message,
      feePaymentType,
      isDialogOTPOpen
    } = this.state;

    return (
      <React.Fragment>
        <Grid container direction="row" justify="center" alignItems="center">
          <Paper className="paper inner-trans">
            {payAccs.length < 1 ? (
              <FormControl fullWidth>
                <Typography
                  variant="title"
                  component="h1"
                  style={{ marginBottom: "25px" }}
                >
                  No payment account available
                </Typography>
                <FormHelperText>
                  Your account may either not has any payment account yet, or
                  none of them has enough balance to make a transaction <br />
                  Please contact a staff for more details
                </FormHelperText>
              </FormControl>
            ) : (
              <div>
                <Typography
                  variant="title"
                  component="h1"
                  style={{ marginBottom: "25px" }}
                >
                  Transaction details
                </Typography>
                <div>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="payAccId">
                      Payments accounts list
                    </InputLabel>
                    {payAccId !== "" && (
                      <Select
                        value={payAccId}
                        onChange={this.handleInputChange}
                        inputProps={{
                          name: "payAccId",
                          id: "payAccId"
                        }}
                      >
                        {payAccs
                          .filter(payAcc => payAcc.balance > 0)
                          .map((payAcc, index) => (
                            <MenuItem key={index} value={payAcc.id}>
                              {payAcc.accNumber}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    <FormHelperText>
                      Current balance: {currentBalance}
                    </FormHelperText>
                  </FormControl>
                  <TextField
                    id="destPayAccNumber"
                    label="Number account of receiver *"
                    autoFocus
                    fullWidth
                    margin="normal"
                    onChange={this.handleInputChange}
                    name="destPayAccNumber"
                  />
                  <TextField
                    id="transferAmount"
                    label="Amount *"
                    type="number"
                    fullWidth
                    margin="normal"
                    onChange={this.handleInputChange}
                    name="transferAmount"
                  />
                  {transferAmountWarning && (
                    <FormHelperText style={{ color: "red" }}>
                      Amount of the transaction is greater than current balance
                    </FormHelperText>
                  )}
                  <TextField
                    id="transferMsg"
                    label="Message *"
                    fullWidth
                    margin="normal"
                    onChange={this.handleInputChange}
                    name="transferMsg"
                  />
                </div>
                <div>
                  <div style={{ textAlign: "left" }}>
                    <FormControl component="div">
                      <FormLabel component="legend">Fee payment type</FormLabel>
                      <RadioGroup
                        aria-label="Fee payment type"
                        name="feePaymentType"
                        value={feePaymentType}
                        onChange={this.handleInputChange}
                      >
                        <FormControlLabel
                          value="transferer"
                          control={<Radio />}
                          label="Transferer"
                        />
                        <FormControlLabel
                          value="receiver"
                          control={<Radio />}
                          label="Receiver"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={this.handleOpenOTPDialog}
                    >
                      send otp
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Paper>
        </Grid>

        {/* dialog to confirm and input OTP */}
        <Dialog
          open={isDialogOTPOpen}
          onClose={this.handleCloseOTPDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            <Typography variant="title" component="span">
              Confirm the transaction
              <br />
              {(!accNumber ||
                !currentBalance ||
                !destName ||
                !destEmail ||
                !destPhone ||
                !destPayAccNumber) && (
                <FormHelperText fullWidth style={{ color: "red" }}>
                  Something went wrong, please try again later
                </FormHelperText>
              )}
            </Typography>
          </DialogTitle>
          <DialogContent style={{ width: "480px" }}>
            <div>
              <FormControl fullWidth>
                <Typography variant="body2" component="p">
                  Payment account number
                </Typography>
                <Typography variant="subtitle1" component="span">
                  {accNumber ? accNumber : "ERROR"}
                </Typography>
                {currentBalance && (
                  <FormHelperText
                    style={{ marginTop: "0", marginBottom: "15px" }}
                  >
                    Current balance: {currentBalance}
                  </FormHelperText>
                )}
              </FormControl>
              <div>
                <Typography variant="body2" component="p">
                  Receiver details
                </Typography>
                <Table style={{ width: "100%" }}>
                  <TableBody>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>{destName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>{destEmail}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Phone</TableCell>
                      <TableCell>{destPhone}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Payment account number</TableCell>
                      <TableCell>{destPayAccNumber}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            <div>
              <TextField
                id="OTP"
                label="OTP *"
                fullWidth
                margin="normal"
                onChange={this.handleInputChange}
                name="OTP"
              />
              <FormHelperText
                onClick={this.handleSendOTP}
                style={{ cursor: "pointer", color: "CornflowerBlue" }}
              >
                Send OTP
              </FormHelperText>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseOTPDialog} color="secondary">
              cancel
            </Button>
            <Button
              onClick={this.handleTransfer}
              color="primary"
              autoFocus
              disabled={
                !accNumber ||
                !currentBalance ||
                !destName ||
                !destEmail ||
                !destPhone ||
                !destPayAccNumber
              }
            >
              confirm
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

export default MustBeCustomer(InternalTransfer);
