import { combineReducers } from "redux";
import payAccStaffReducer from "./payAccStaffReducer";
import customersReducer from "./customersReducer";

const indexReducer = combineReducers({
  payAccStaff: payAccStaffReducer,
  customers: customersReducer
});

export default indexReducer;
