import React, { Component } from "react";
import axios from "axios";
import {
  Button,
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
  TextField
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
    destPayAccId: "",
    transferAmount: "",
    transferMsg: "",
    feePaymentType: "transferer",
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
    this.setState({ [name]: value });
  };

  handleCloseMessage = () => {
    this.setState({ isMessageOpen: false });
  };

  handleSendOTP = () => {};

  handleTransfer = () => {
    const {
      payAccId,
      destPayAccId,
      transferAmount,
      transferMsg,
      feePaymentType,
      OTP
    } = this.state;

    if (
      payAccId === "" ||
      destPayAccId === "" ||
      transferMsg === "" ||
      OTP === ""
    )
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

    console.log(
      payAccId,
      destPayAccId,
      transferAmount,
      transferMsg,
      feePaymentType,
      OTP
    );
  };

  render() {
    const {
      payAccs,
      payAccId,
      currentBalance,
      isMessageOpen,
      messageType,
      message,
      feePaymentType
    } = this.state;

    return (
      <React.Fragment>
        <Grid container direction="row" justify="center" alignItems="center">
          <Paper className="paper inner-trans form-2-cols">
            <div>
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
                      {payAccs.map((payAcc, index) => (
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
                  id="destPayAccId"
                  label="Number account of receiver *"
                  type="number"
                  autoFocus
                  fullWidth
                  margin="normal"
                  onChange={this.handleInputChange}
                  name="destPayAccId"
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
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={this.handleTransfer}
                  >
                    transfer
                  </Button>
                </div>
              </div>
            </div>
          </Paper>
        </Grid>
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
