import React from "react";
import { Redirect } from "react-router-dom";
import { getUserInfo } from "../utils/authHelper";

export default function Home() {
  const userType = +getUserInfo("f_type");
  // 1: client, 2: staff
  const redirectTo = userType === 1 ? "/payment-accounts" : "/customers";
  return <Redirect to={redirectTo} />;
}
