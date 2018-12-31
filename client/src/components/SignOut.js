import React from "react";
import { Redirect } from "react-router-dom";
import authHelper from "../utils/authHelper";

export default function SignOut() {
  authHelper.signOut();
  return <Redirect to="/sign-in" />;
}
