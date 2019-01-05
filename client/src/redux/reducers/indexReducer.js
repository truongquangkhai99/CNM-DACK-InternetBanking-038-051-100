import { combineReducers } from "redux";
import payAccStaffReducer from "./payAccStaffReducer";

const indexReducer = combineReducers({
  payAccStaff: payAccStaffReducer
});

export default indexReducer;
