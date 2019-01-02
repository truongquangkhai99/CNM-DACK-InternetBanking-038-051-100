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
    receiverPayAccNumber: "",
    receiverName: "",
    receiverEmail: "",
    receiverPhone: "",
    transferAmount: "",
    transferMsg: "",
    feeType: 1,
    isDialogOTPOpen: false,
    OTP: "",
    checkOTP: null
  };

  getPayAccsList = () => {
    const customerId = getUserInfo("f_id");

    if (customerId === null)
      return this.setState({
        messageType: "error",
        isMessageOpen: true,
        message: "Sorry, could not get your entity, please sign in again"
      });

    axios
      .get(`http://localhost:3001/pay-accs/${customerId}`)
      .then(resp => {
        const { status, data } = resp;
        if (status === 200) {
          // only accounts with balance > 0
          const payAccs = data.filter(payAcc => +payAcc.balance > 0);
          if (payAccs.length > 0)
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

  componentDidMount = () => {
    this.getPayAccsList();
  };

  handleInputChange = e => {
    const { name, value } = e.target;
    if (name === "payAccId")
      return this.setState({
        [name]: value,
        currentBalance: this.state.payAccs.find(payAcc => payAcc.id === value)
          .balance
      });

    this.setState({ [name]: value });
  };

  handleCloseMessage = () => {
    this.setState({ isMessageOpen: false });
  };

  handleCloseOTPDialog = () => {
    this.setState({ isDialogOTPOpen: false });
  };

  handleOpenOTPDialog = () => {
    const clientName = getUserInfo("f_name"),
      clientEmail = getUserInfo("f_email");

    const { receiverPayAccNumber } = this.state;

    if (clientName === null || clientEmail === null)
      return this.setState({
        messageType: "error",
        isMessageOpen: true,
        message:
          "Sorry, failed getting your entity, please sign in or try again later"
      });

    axios
      .all([
        axios.post("http://localhost:3001/send-otp", {
          clientEmail,
          clientName
        }),
        axios.get(`http://localhost:3001/pay-acc/${receiverPayAccNumber}`)
      ])
      .then(
        axios.spread((getOTP, getReceiver) => {
          if (getOTP.status !== 201) {
            this.setState({
              messageType: "error",
              isMessageOpen: true,
              message:
                "Sorry, failed sending request for OTP, please try again later"
            });
            throw new Error(
              "Something went wrong when requesting for OTP, status ",
              getOTP.status
            );
          }

          if (getReceiver.status !== 200) {
            this.setState({
              messageType: "error",
              isMessageOpen: true,
              message:
                "Sorry, failed getting receiver details , please try again later"
            });
            throw new Error(
              "Something went wrong when getting receiver details, status ",
              getOTP.status
            );
          }

          const {
            data: { otp: checkOTP }
          } = getOTP;

          if (getReceiver.data.length < 1)
            return this.setState({
              messageType: "warning",
              isMessageOpen: true,
              message: `No payment account attached to ${receiverPayAccNumber}, please try another one`
            });

          const {
            clientName: receiverName,
            clientEmail: receiverEmail,
            phone: receiverPhone
          } = getReceiver.data[0];

          this.setState({
            checkOTP,
            receiverName,
            receiverEmail,
            receiverPhone,
            receiverPayAccNumber,
            isDialogOTPOpen: true
          });
        })
      )
      .catch(err => {
        this.setState({
          messageType: "error",
          isMessageOpen: true,
          message:
            "Sorry, failed sending request for OTP or getting receiver details, please try again later"
        });
        console.log(err);
      });
  };

  handleTransfer = () => {
    // check inputs
    // call API
    // succeed
    this.setState(
      {
        isDialogOTPOpen: false,
        messageType: "success",
        isMessageOpen: true,
        message: "Successfully operated the transaction",
        // reset form
        receiverPayAccNumber: "",
        transferAmount: "",
        transferMsg: "",
        OTP: "",
        checkOTP: "",
        feeType: 1
      }, // refresh payment accounts
      this.getPayAccsList
    );
  };

  checkValidInputs = () => {
    const {
      payAccs,
      currentBalance,
      receiverPayAccNumber,
      transferAmount,
      transferMsg
    } = this.state;

    if (receiverPayAccNumber === "") return true;

    if (
      transferAmount === "" ||
      transferAmount < 1 ||
      +transferAmount > +currentBalance
    )
      return true;

    if (transferMsg === "") return true;

    if (
      payAccs.length > 0 &&
      payAccs.map(payAcc => payAcc.accNumber).includes(receiverPayAccNumber)
    )
      return true;

    return false;
  };

  render() {
    const {
      payAccs,
      payAccId,
      accNumber,
      currentBalance,
      transferAmount,
      transferMsg,
      receiverName,
      receiverEmail,
      receiverPhone,
      receiverPayAccNumber,
      isMessageOpen,
      messageType,
      message,
      feeType,
      isDialogOTPOpen,
      OTP,
      checkOTP
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
                    id="receiverPayAccNumber"
                    label="Account number of receiver *"
                    autoFocus
                    fullWidth
                    margin="normal"
                    onChange={this.handleInputChange}
                    name="receiverPayAccNumber"
                    value={receiverPayAccNumber}
                  />
                  {payAccs
                    .map(payAcc => payAcc.accNumber)
                    .includes(receiverPayAccNumber) && (
                    <FormHelperText style={{ color: "red" }}>
                      Cannot make this transaction type for your own payment
                      accounts
                    </FormHelperText>
                  )}
                  <TextField
                    id="transferAmount"
                    label="Amount *"
                    type="number"
                    fullWidth
                    margin="normal"
                    onChange={this.handleInputChange}
                    name="transferAmount"
                    value={transferAmount}
                  />
                  {+transferAmount > +currentBalance && (
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
                    value={transferMsg}
                  />
                </div>
                <div>
                  <div style={{ textAlign: "left" }}>
                    <FormControl component="div">
                      <FormLabel component="legend">Fee payment type</FormLabel>
                      <RadioGroup
                        aria-label="Fee payment type"
                        name="feeType"
                        value={feeType}
                        onChange={this.handleInputChange}
                      >
                        <FormControlLabel
                          value={1}
                          control={<Radio />}
                          label="Sender"
                        />
                        <FormControlLabel
                          value={2}
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
                      disabled={this.checkValidInputs()}
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
                !receiverName ||
                !receiverEmail ||
                !receiverPhone ||
                !receiverPayAccNumber) && (
                <FormHelperText style={{ color: "red" }}>
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
                  {accNumber}
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
                      <TableCell>{receiverName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>{receiverEmail}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Phone</TableCell>
                      <TableCell>{receiverPhone}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Payment account number</TableCell>
                      <TableCell>{receiverPayAccNumber}</TableCell>
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
                value={OTP}
              />
              {OTP.length > 6 ? (
                <FormHelperText style={{ color: "red" }}>
                  OTP code is 6 characters long
                </FormHelperText>
              ) : (
                <FormHelperText>6 characters</FormHelperText>
              )}
              {OTP.length === 6 && OTP !== checkOTP && (
                <FormHelperText style={{ color: "red" }}>
                  OTP unmatched
                </FormHelperText>
              )}
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
                !receiverName ||
                !receiverEmail ||
                !receiverPhone ||
                !receiverPayAccNumber ||
                OTP.length !== 6 ||
                OTP !== checkOTP
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
