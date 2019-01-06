// import * as payAccClientConstants from "../constants/payAccClientConstants";
import * as messageConstants from "../constants/messageConstants";

const initState = {
  payAccs: [],
  histories: [],
  // pay in panel
  payAccId: "",
  accNumber: "",
  currentBalance: 0,
  // for dialog confirming closing payment account
  isDialogClosePayAccOpen: false,
  // for dialog viewing payment account history
  isDialogHistoryPayAccOpen: false,
  // transfer remaining balance of closing payment account to current customer's another one
  receiverPayAccNumber: "",
  // for notify message
  isMessageOpen: false,
  messageType: "",
  message: "",
  reload: false
};

const payAccClientReducer = (state = initState, action) => {
  switch (action.type) {
    case messageConstants.CLOSE_MESSAGE:
      return { ...state, isMessageOpen: false };
    default:
      return state;
  }
};

export default payAccClientReducer;
