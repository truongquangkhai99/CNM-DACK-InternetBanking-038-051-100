import React from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Button, Grid, Paper, TextField, Typography } from "@material-ui/core";
import Recaptcha from "react-recaptcha";
import Message from "./Message";
import { checkAuth, signIn } from "../utils/authHelper";

export default class SignIn extends React.Component {
  state = {
    captcha: false,
    username: "",
    password: "",
    redirectToReferrer: checkAuth(),
    // for notify message
    isMessageOpen: false,
    messageType: "",
    message: ""
  };

  componentDidMount() {
    document.addEventListener("keyup", this.handleEnterKeyup);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleEnterKeyup);
  }

  // submit form by pressing Enter key rather than button
  handleEnterKeyup = ({ keyCode }) => +keyCode === 13 && this.handleSignIn();

  handleInputChange = e => this.setState({ [e.target.name]: e.target.value });

  handleCaptchaVerify = res => this.setState({ captcha: true });

  handleSignIn = () => {
    const { username, password, captcha } = this.state;
    // validate captcha
    // if (captcha === false) return;
    // validate username, password
    if (username === "" || password === "") return;

    // submit data
    axios
      .post("http://localhost:3001/auth/login", {
        username,
        pwd: password
        // type: 2
      })
      .then(resp => {
        const {
          status,
          data: { auth, access_token, refresh_token }
        } = resp;
        if (status === 200 && auth === true) {
          signIn(access_token, refresh_token);
          this.setState({ redirectToReferrer: true });
        } else {
          this.setState({
            messageType: "error",
            isMessageOpen: true,
            message: "Email or password was wrong"
          });
          throw new Error(
            "Something went wrong when signing in, status ",
            status
          );
        }
      })
      .catch(err => {
        this.setState({
          messageType: "error",
          isMessageOpen: true,
          message: "Email or password was wrong"
        });
        console.log(err);
      });
  };

  handleCloseMessage = () => {
    this.setState({ isMessageOpen: false });
  };

  render() {
    const {
      redirectToReferrer,
      messageType,
      isMessageOpen,
      message
    } = this.state;
    const { from } = this.props.location.state || {
      from: { pathname: "/" }
    };

    return redirectToReferrer === true ? (
      <Redirect to={from} />
    ) : (
      <Grid
        className="page__account"
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Paper className="form-panel">
          <div>
            <div>
              <Typography variant="title" component="h1">
                INTERNET BANKING
              </Typography>
              <TextField
                id="signInUsername"
                label="Username"
                type="text"
                autoFocus
                fullWidth
                margin="normal"
                onChange={this.handleInputChange}
                name="username"
              />
              <TextField
                id="signInPassword"
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                onChange={this.handleInputChange}
                name="password"
              />
              <div className="captcha-container">
                <Recaptcha
                  sitekey="6LfCAoUUAAAAAPHQTGofRMltqShtjI9L9wvl90LG"
                  render="explicit"
                  onloadCallback={() => true}
                  verifyCallback={this.handleCaptchaVerify}
                />
              </div>
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={this.handleSignIn}
                >
                  SIGN IN
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
      </Grid>
    );
  }
}
