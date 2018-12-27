import React from "react";
import { Redirect, Link } from "react-router-dom";
import { Button, TextField } from "@material-ui/core";
import Recaptcha from "react-recaptcha";

export default class Signin extends React.Component {
  state = {
    captcha: false,
    email: "",
    password: "",
    redirectToReferrer: false
  };

  componentDidMount() {
    document.addEventListener("keyup", this.handleEnterKeyup);
  }

  componentWillMount() {
    document.removeEventListener("keyup", this.handleEnterKeyup);
  }

  // submit form by pressing Enter key rather than button
  handleEnterKeyup = ({ keyCode }) => +keyCode === 13 && this.handleSignIn();

  handleInputChange = e => this.setState({ [e.target.name]: e.target.value });

  handleCaptchaVerify = res => this.setState({ captcha: true });

  handleSignIn = () => {
    const { email, password, captcha } = this.state;

    // validate captcha
    if (captcha === false) return;
    // validate email
    const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRegEx.test(email) === false) return;
    // validate password
    if (password === "") return;

    // sign in succeed
    this.setState({ redirectToReferrer: true });
  };

  render() {
    const { redirectToReferrer } = this.state;
    const { from } = this.props.location.state || { from: { pathname: "/" } };

    return redirectToReferrer === true ? (
      <Redirect to={from} />
    ) : (
      <div className="page__account">
        <form onSubmit={this.handleSignIn} className="form-panel">
          <div>
            <h1>INTERNET BANKING</h1>
            <TextField
              id="signInEmail"
              label="Email"
              type="email"
              autoFocus
              fullWidth
              margin="normal"
              onChange={this.handleInputChange}
              name="email"
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
            <div>
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
            <div>
              <Link to="/sign-up">Don't have an account yet? Sign up!</Link>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
