import * as payAccStaffConstants from "../constants/payAccStaffConstants";
import * as messageConstants from "../constants/messageConstants";

const initState = {
  payAccs: [],
  // pay in panel
  payAccId: "",
  accNumber: "",
  clientName: "",
  clientEmail: "",
  currentBalance: 0,
  // for notify message
  isMessageOpen: false,
  messageType: "",
  message: "",
  // toggle pay in panel
  togglePayInPanel: false
};

const payAccStaffReducer = (state = initState, action) => {
  switch (action.type) {
    case payAccStaffConstants.GET_PAY_ACCS_LIST_SUCCEED:
      return { ...state, payAccs: action.payload };
    case payAccStaffConstants.OPEN_PAY_IN_PANEL:
      return {
        ...state,
        ...action.payload
      };
    case payAccStaffConstants.CLOSE_PAY_IN_PANEL:
      return {
        ...state,
        ...action.payload
      };
    case payAccStaffConstants.HANDLE_PAY_IN_SUCCEED:
      return {
        ...state,
        currentBalance: action.payload.currentBalance
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
        messageType: "",
        isMessageOpen: false,
        message: ""
      };
    default:
      return state;
  }
};

export default payAccStaffReducer;
