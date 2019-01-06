import axios from "axios";
import { getCookie } from "tiny-cookie";
import * as payAccStaffConstants from "../constants/payAccStaffConstants";
import * as messageConstants from "../constants/messageConstants";

export const getPayAccsList = () => dispatch =>
  axios
    .get("http://localhost:3001/pay-accs", {
      headers: {
        "x-access-token": getCookie("access_token")
      }
    })
    .then(resp => {
      const { status, data: payAccs } = resp;
      if (status === 200) {
        dispatch({
          type: payAccStaffConstants.GET_PAY_ACCS_LIST_SUCCEED,
          payload: payAccs
        });
      } else {
        dispatch({
          type: messageConstants.OPEN_MESSAGE,
          payload: {
            messageType: "error",
            message: "Failed getting payment accounts list"
          }
        });
        throw new Error(
          "Something went wrong when  getting payment accounts list, status ",
          status
        );
      }
    })
    .catch(err => {
      dispatch({
        type: messageConstants.OPEN_MESSAGE,
        payload: {
          messageType: "error",
          message: "Failed getting payment accounts list"
        }
      });
      console.log(err);
    });

export const openPayInPanel = (
  payAccId,
  accNumber,
  clientName,
  clientEmail,
  currentBalance
) => ({
  type: payAccStaffConstants.OPEN_PAY_IN_PANEL,
  payload: {
    payAccId,
    accNumber,
    clientName,
    clientEmail,
    currentBalance,
    togglePayInPanel: true
  }
});

export const closePayInPanel = () => ({
  type: payAccStaffConstants.CLOSE_PAY_IN_PANEL,
  payload: {
    togglePayInPanel: false,
    payAccId: "",
    accNumber: "",
    clientEmail: "",
    clientName: "",
    currentBalance: 0
  }
});

export const handlePayInSucceed = amount => ({
  type: payAccStaffConstants.HANDLE_PAY_IN_SUCCEED,
  payload: {
    currentBalance: +amount
  }
});
