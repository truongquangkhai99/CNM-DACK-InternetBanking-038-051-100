import { combineReducers } from "redux";
import payAccStaffReducer from "./payAccStaffReducer";
import customersReducer from "./customersReducer";
import payAccClientReducer from "./payAccClientReducer";
import contactsReducer from "./contactsReducer";

const indexReducer = combineReducers({
  payAccStaff: payAccStaffReducer,
  customers: customersReducer,
  payAccClient: payAccClientReducer,
  contacts: contactsReducer
});

export default indexReducer;
