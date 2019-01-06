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
    payAccsTransferable: [],
    payAccId: "",
    currentBalance: 0,
    // for notify message
    isMessageOpen: false,
    messageType: "",
    message: "",
    receiverPayAccId: "",
    receiverPayAccNumber: "",
    receiverName: "",
    receiverEmail: "",
    receiverPhone: "",
    receiverCurrentBalance: 0,
    transferAmount: "",
    transferMsg: "",
    feeType: "1",
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
          const payAccs = data,
            payAccsTransferable = data.filter(payAcc => +payAcc.balance > 0);
          if (payAccs.length > 0)
            // default selected payment account
            this.setState({
              payAccs,
              payAccsTransferable
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
        accNumber: this.state.payAccs.find(payAcc => payAcc.id === value)
          .accNumber,
        currentBalance: +this.state.payAccs.find(payAcc => payAcc.id === value)
          .balance
      });

    this.setState({ [name]: value });
  };

  handleCloseMessage = () => {
    this.setState({ isMessageOpen: false, message: "" });
  };

  handleCloseOTPDialog = () => {
    this.setState({
      isDialogOTPOpen: false,
      checkOTP: "",
      OTP: "",
      receiverPayAccId: "",
      receiverName: "",
      receiverEmail: "",
      receiverPhone: "",
      receiverCurrentBalance: 0
    });
  };

  handleOpenOTPDialog = () => {
    const clientName = getUserInfo("f_name"),
      clientEmail = getUserInfo("f_email");

    const {
      receiverPayAccNumber,
      feeType,
      currentBalance,
      transferAmount
    } = this.state;

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
            id: receiverPayAccId,
            clientName: receiverName,
            clientEmail: receiverEmail,
            phone: receiverPhone,
            balance: receiverCurrentBalance
          } = getReceiver.data[0];

          const senderFee = +feeType === 1 ? 10000 : 0,
            receiverFee = +feeType === 2 ? 10000 : 0;
          if (+feeType === 1 && +senderFee > +currentBalance - +transferAmount)
            return this.setState({
              messageType: "error",
              isMessageOpen: true,
              message: "Remaining balance is not enough for extra fee"
            });
          if (
            +feeType === 2 &&
            +receiverFee > +receiverCurrentBalance + +transferAmount
          )
            return this.setState({
              messageType: "error",
              isMessageOpen: true,
              message: "Transaction failed. Contact your receiver for detail."
            });

          this.setState({
            checkOTP,
            receiverPayAccId,
            receiverName,
            receiverEmail,
            receiverPhone,
            receiverPayAccNumber,
            receiverCurrentBalance,
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
    const {
      payAccId,
      accNumber,
      currentBalance,
      transferAmount,
      receiverPayAccId,
      receiverPayAccNumber,
      receiverCurrentBalance,
      feeType,
      transferMsg
    } = this.state;

    // call API
    const senderFee = +feeType === 1 ? 10000 : 0,
      receiverFee = +feeType === 2 ? 10000 : 0;

    axios
      .all([
        axios.patch("http://localhost:3001/pay-acc/balance", {
          payAccId,
          newBalance: +currentBalance - +transferAmount - senderFee
        }),
        axios.patch("http://localhost:3001/pay-acc/balance", {
          payAccId: receiverPayAccId,
          newBalance: +receiverCurrentBalance + +transferAmount - receiverFee
        }),
        axios.post("http://localhost:3001/history", {
          payAccId,
          fromAccNumber: accNumber,
          toAccNumber: receiverPayAccNumber,
          amount: +transferAmount,
          transactionType: "sent",
          feeType: -+senderFee,
          message: transferMsg
        }),
        axios.post("http://localhost:3001/history", {
          payAccId: receiverPayAccId,
          fromAccNumber: accNumber,
          toAccNumber: receiverPayAccNumber,
          amount: +transferAmount,
          transactionType: "received",
          feeType: -+receiverFee,
          message: transferMsg
        })
      ])
      .then(
        axios.spread(
          (
            updateSenderPayAcc,
            updateReceiverPayAcc,
            sendHistory,
            receiveHistory
          ) => {
            if (
              updateSenderPayAcc.status !== 201 ||
              updateReceiverPayAcc.status !== 201
            ) {
              this.setState({
                messageType: "error",
                isMessageOpen: true,
                message: "Sorry, transaction failed"
              });
              throw new Error(
                "Something went wrong operating transaction, status ",
                updateSenderPayAcc.status
              );
            }

            if (sendHistory.status !== 201 || receiveHistory.status !== 201) {
              this.setState({
                messageType: "error",
                isMessageOpen: true,
                message: "Sorry, failed updating history of the transaction"
              });
              throw new Error(
                "Something went wrong when updating history of the transaction, status ",
                updateSenderPayAcc.status
              );
            }

            if (
              updateSenderPayAcc.status === 201 &&
              updateReceiverPayAcc.status === 201 &&
              sendHistory.status === 201 &&
              receiveHistory.status === 201
            )
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
                  feeType: "1"
                }, // refresh payment accounts
                this.getPayAccsList
              );
          }
        )
      )
      .catch(err => {
        console.log(err);
      });
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
      +transferAmount < 1 ||
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
      payAccsTransferable,
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
            {payAccsTransferable.length < 1 ? (
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

                    <Select
                      value={payAccId}
                      onChange={this.handleInputChange}
                      inputProps={{
                        name: "payAccId",
                        id: "payAccId"
                      }}
                      autoFocus
                    >
                      {payAccsTransferable.map((payAcc, index) => (
                        <MenuItem key={index} value={payAcc.id}>
                          {payAcc.accNumber}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      Current balance: {currentBalance}
                    </FormHelperText>
                    {payAccId !== "" && currentBalance < 10000 && (
                      <FormHelperText style={{ color: "red" }}>
                        Current balance is not enough for the extra fee
                      </FormHelperText>
                    )}
                  </FormControl>
                  <TextField
                    id="receiverPayAccNumber"
                    label="Account number of receiver *"
                    fullWidth
                    margin="normal"
                    onChange={this.handleInputChange}
                    name="receiverPayAccNumber"
                    value={receiverPayAccNumber}
                    disabled={currentBalance < 10000}
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
                    disabled={currentBalance < 10000}
                  />
                  {+transferAmount > +currentBalance && (
                    <FormHelperText style={{ color: "red" }}>
                      Amount of the transaction must not be greater than current
                      balance
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
                    disabled={currentBalance < 10000}
                  />
                </div>
                <div>
                  <div style={{ textAlign: "left" }}>
                    <FormControl component="div">
                      <FormLabel component="legend">
                        Fee payment type (-10.000)
                      </FormLabel>
                      <RadioGroup
                        aria-label="Fee payment type (-10.000)"
                        name="feeType"
                        value={feeType}
                        onChange={this.handleInputChange}
                      >
                        <FormControlLabel
                          value="1"
                          control={<Radio />}
                          label="Sender"
                          disabled={currentBalance < 10000}
                        />
                        <FormControlLabel
                          value="2"
                          control={<Radio />}
                          label="Receiver"
                          disabled={currentBalance < 10000}
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
                      Transfer
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
                isNaN(currentBalance) ||
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
                {!isNaN(currentBalance) && (
                  <FormHelperText
                    style={{ marginTop: "0", marginBottom: "15px" }}
                  >
                    Current balance: {+currentBalance}
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
                autoFocus
              />
              <FormHelperText style={{ color: OTP.length > 6 && "red" }}>
                OTP code is 6 characters long
              </FormHelperText>
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
              disabled={OTP.length !== 6 || OTP !== checkOTP}
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
