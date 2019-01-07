import axios from "axios";
import { getCookie } from "tiny-cookie";
import * as customersConstants from "../constants/customersConstants";
import * as messageConstants from "../constants/messageConstants";

export const getCustomersList = () => dispatch =>
  axios
    .get("http://localhost:3001/customers", {
      headers: {
        "x-access-token": getCookie("access_token")
      }
    })
    .then(resp => {
      const { status, data: customers } = resp;
      if (status === 200) {
        dispatch({
          type: customersConstants.GET_CUSTOMERS_LIST_SUCCEED,
          payload: customers
        });
      } else {
        dispatch({
          type: messageConstants.OPEN_MESSAGE,
          payload: {
            messageType: "error",
            message: "Failed getting customers list."
          }
        });
        throw new Error(
          "Something went wrong when  getting customers list, status ",
          status
        );
      }
    })
    .catch(err => {
      dispatch({
        type: messageConstants.OPEN_MESSAGE,
        payload: {
          messageType: "error",
          message: "Failed getting customers list."
        }
      });
      console.log(err);
    });

export const handleCreatePayAcc = (
  customerId,
  clientEmail,
  clientName,
  phone
) => dispatch =>
  axios
    .post(
      "http://localhost:3001/pay-acc",
      {
        customerId,
        clientEmail,
        clientName,
        phone
      },
      {
        headers: {
          "x-access-token": getCookie("access_token")
        }
      }
    )
    .then(resp => {
      const {
        status,
        data: { accNumber }
      } = resp;
      if (status === 201) {
        dispatch({
          type: customersConstants.HANDLE_CREATE_PAY_ACC_SUCCEED,
          payload: {
            isCreatePayAccDialogConfirmOpen: false,
            customerId: "",
            clientEmail: "",
            clientName: "",
            isCreatePayAccDialogOperatedOpen: true,
            payAccNumber: accNumber
          }
        });
      } else {
        dispatch({
          type: customersConstants.HANDLE_CREATE_PAY_ACC_ERROR,
          payload: {
            isCreatePayAccDialogConfirmOpen: false,
            customerId: "",
            clientEmail: "",
            clientName: "",
            messageType: "error",
            message: "Failed creating payment account"
          }
        });
        throw new Error(
          "Something went wrong when  creating payment account, status ",
          status
        );
      }
    })
    .catch(err => {
      dispatch({
        type: customersConstants.HANDLE_CREATE_PAY_ACC_ERROR,
        payload: {
          isCreatePayAccDialogConfirmOpen: false,
          customerId: "",
          clientEmail: "",
          clientName: "",
          messageType: "error",
          message: "Failed creating payment account"
        }
      });
      console.log(err);
    });

export const openCreatePayAccConfirmDialog = (
  customerId,
  clientEmail,
  clientName,
  phone
) => ({
  type: customersConstants.OPEN_CREATE_PAY_ACC_DIALOG_CONFIRM,
  payload: {
    customerId,
    clientEmail,
    clientName,
    phone
  }
});

export const closeCreatePayAccConfirmDialog = () => ({
  type: customersConstants.CLOSE_CREATE_PAY_ACC_DIALOG_CONFIRM
});

export const closeCreatePayAccOperatedDialog = () => ({
  type: customersConstants.CLOSE_CREATE_PAY_ACC_DIALOG_OPERATED
});
