import React from "react";
import { Redirect, Link } from "react-router-dom";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from "@material-ui/core";
import Recaptcha from "react-recaptcha";

export default class SignUp extends React.Component {
  state = {
    address: "",
    captcha: false,
    email: "",
    gender: "male",
    name: "",
    password: "",
    phone: "",
    redirectToReferrer: false
  };

  componentDidMount() {
    document.addEventListener("keyup", this.handleEnterKeyup);
  }

  componentWillMount() {
    document.removeEventListener("keyup", this.handleEnterKeyup);
  }

  // submit login form pressing Enter key rather than button
  handleEnterKeyup = ({ keyCode }) => +keyCode === 13 && this.handleSignUp();

  handleInputChange = e => {
    const { name, value } = e.target;
    const { phone } = this.state;
    // validate phone
    if (
      name === "phone" &&
      ((phone.length === 0 && (value !== "+" && isNaN(value))) ||
        (phone.length === 1 && isNaN(value)))
    )
      return;

    this.setState({ [name]: value });
  };

  handleCaptchaVerify = res => res && this.setState({ captcha: true });

  handleSignUp = () => {
    const { address, email, name, password, phone, captcha } = this.state;
    // validate captcha
    if (captcha === false) return;
    // validate email
    const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRegEx.test(email) === false) return;
    // validate address, name, password, phone
    if (address === "" || name === "" || password === "" || phone === "")
      return;

    // sign up succeed
    this.setState({ redirectToReferrer: true });
  };

  render() {
    const { redirectToReferrer } = this.state;
    const { from } = this.props.location.state || { from: { pathname: "/" } };

    return redirectToReferrer === true ? (
      <Redirect
        to={{
          pathname: "/sign-in",
          state: {
            from
          }
        }}
      />
    ) : (
      <Grid
        className="page__account"
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Paper className="form-panel sign-up">
          <div>
            <Typography variant="title" component="h1">
              INTERNET BANKING
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
                id="signUpPassword"
                label="Password *"
                type="password"
                fullWidth
                margin="normal"
                onChange={this.handleInputChange}
                name="password"
              />
              <TextField
                id="signUpAddress"
                label="Address *"
                fullWidth
                margin="normal"
                onChange={this.handleInputChange}
                name="address"
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
              <div style={{ textAlign: "left" }}>
                <FormControl component="div">
                  <FormLabel component="legend">Gender</FormLabel>
                  <RadioGroup
                    aria-label="Gender"
                    name="gender"
                    value={this.state.gender}
                    onChange={this.handleInputChange}
                  >
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="other"
                      control={<Radio />}
                      label="Other"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
              <Recaptcha
                sitekey="6LfCAoUUAAAAAPHQTGofRMltqShtjI9L9wvl90LG"
                render="explicit"
                onloadCallback={() => true}
                verifyCallback={this.handleCaptchaVerify}
              />
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={this.handleSignUp}
                >
                  SIGN UP
                </Button>
              </div>
              <div>
                <Link to="/sign-in">Already had an account? Sign in!</Link>
              </div>
            </div>
          </div>
        </Paper>
      </Grid>
    );
  }
}
