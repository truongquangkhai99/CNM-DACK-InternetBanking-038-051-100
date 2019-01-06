import * as customersConstants from "../constants/customersConstants";
import * as messageConstants from "../constants/messageConstants";

const initState = {
  customers: [],
  // for notify message
  isMessageOpen: false,
  messageType: "",
  message: "",
  // for dialog confirm creating new payment account
  isCreatePayAccDialogConfirmOpen: false,
  customerId: "",
  clientEmail: "",
  clientName: "",
  // for dialog notify about newly created payment account number
  isCreatePayAccDialogOperatedOpen: false,
  payAccNumber: ""
};

const customersReducer = (state = initState, action) => {
  switch (action.type) {
    case customersConstants.GET_CUSTOMERS_LIST_SUCCEED:
      return {
        ...state,
        customers: action.payload
      };
    case customersConstants.OPEN_CREATE_PAY_ACC_DIALOG_CONFIRM:
      return {
        ...state,
        isCreatePayAccDialogConfirmOpen: true,
        ...action.payload
      };
    case customersConstants.CLOSE_CREATE_PAY_ACC_DIALOG_CONFIRM:
      return {
        ...state,
        isCreatePayAccDialogConfirmOpen: false,
        customerId: "",
        clientEmail: "",
        clientName: ""
      };
    case customersConstants.HANDLE_CREATE_PAY_ACC_SUCCEED:
      return {
        ...state,
        ...action.payload
      };
    case customersConstants.CLOSE_CREATE_PAY_ACC_DIALOG_OPERATED:
      return {
        ...state,
        isCreatePayAccDialogOperatedOpen: false,
        payAccNumber: ""
      };
    case messageConstants.OPEN_MESSAGE:
      return {
        ...state,
        ...action.payload,
        isMessageOpen: true
      };
    case messageConstants.CLOSE_MESSAGE:
      return {
        ...state,
        isMessageOpen: false
      };
    default:
      return state;
  }
};

export default customersReducer;
