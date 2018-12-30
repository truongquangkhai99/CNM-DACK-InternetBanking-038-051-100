import React, { Component } from "react";
import axios from "axios";
import { Button, Paper, TextField, Typography } from "@material-ui/core";
import Message from "./Message";

export default class CreateAccount extends Component {
  state = {
    username: "",
    password: "",
    email: "",
    name: "",
    phone: "",
    isMessageOpen: false,
    messageType: "",
    message: ""
  };

  componentDidMount = () => {
    document.addEventListener("keyup", this.handleEnterKeyup);
  };

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleEnterKeyup);
  }

  // submit form pressing Enter key rather than button
  handleEnterKeyup = ({ keyCode }) => +keyCode === 13 && this.handleSignUp();

  handleInputChange = e => {
    const { name, value } = e.target;
    const { phone } = this.state;
    // validate phone
    const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\./0-9]*$/;
    if (name === "phone" && phoneRegex.test(phone + value.toString()) === false)
      return;

    this.setState({ [name]: value });
  };

  handleSignUp = () => {
    const { username, email, name, password, phone } = this.state;
    // validate email
    const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRegEx.test(email) === false)
      return this.setState({
        messageType: "warning",
        isMessageOpen: true,
        message: "Check if email were in invalid format or empty"
      });
    // validate address, name, password, phone
    if (
      username.trim() === "" ||
      name.trim() === "" ||
      password === "" ||
      phone === ""
    )
      return this.setState({
        messageType: "warning",
        isMessageOpen: true,
        message: "Check if any required filed were empty"
      });

    axios
      .post("http://localhost:3001/auth/user", {
        Username: username,
        Password: password,
        Name: name,
        Phone: phone,
        Email: email,
        Type: "1"
      })
      .then(resp => {
        const { status } = resp;
        if (status === 201) {
          this.setState({
            messageType: "success",
            isMessageOpen: true,
            message: "Successfully created customer account"
          });
          this.props.onCreateAccountSucceed();
        } else {
          this.setState({
            messageType: "error",
            isMessageOpen: true,
            message: "Failed creating customer account"
          });
          throw new Error("Something wrong while signing up, status ", status);
        }
      })
      .catch(err => {
        this.setState({
          messageType: "error",
          isMessageOpen: true,
          message: "Failed creating customer account"
        });
        console.log(err);
      });
  };

  handleCloseMessage = () => {
    this.setState({ isMessageOpen: false });
  };

  render() {
    const { isMessageOpen, messageType, message } = this.state;

    return (
      <React.Fragment>
        <Paper className="sign-up">
          <div>
            <Typography variant="title" component="h1">
              Create customer account
            </Typography>
            <div>
              <TextField
                id="signUpName"
                label="Name *"
                autoFocus
                fullWidth
                margin="normal"
                onChange={this.handleInputChange}
                name="name"
              />
              <TextField
                id="signUpEmail"
                label="Email *"
                type="email"
                fullWidth
                margin="normal"
                onChange={this.handleInputChange}
                name="email"
              />
              <TextField
                id="signUpPhone"
                label="Phone *"
                fullWidth
                margin="normal"
                onChange={this.handleInputChange}
                name="phone"
                value={this.state.phone}
              />
            </div>
            <div>
              <div>
                <TextField
                  id="signUpUsername"
                  label="Username *"
                  fullWidth
                  margin="normal"
                  onChange={this.handleInputChange}
                  name="username"
                />
                <TextField
                  id="signUpPassword"
                  label="Password *"
                  type="password"
                  fullWidth
                  margin="normal"
                  onChange={this.handleInputChange}
                  name="password"
                />
              </div>
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={this.handleSignUp}
                >
                  CREATE ACCOUNT
                </Button>
              </div>
            </div>
          </div>
        </Paper>

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
