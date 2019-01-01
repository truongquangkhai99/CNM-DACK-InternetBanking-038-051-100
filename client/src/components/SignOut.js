import React from "react";
import { Redirect } from "react-router-dom";
import { signOut } from "../utils/authHelper";

export default function SignOut() {
  signOut();
  return <Redirect to="/sign-in" />;
}
