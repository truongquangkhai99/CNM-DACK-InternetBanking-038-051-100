import { createStore, applyMiddleware } from "redux";
import indexReducer from "./reducers/indexReducer";
import thunk from "redux-thunk";

const store = createStore(indexReducer, applyMiddleware(thunk));

export default store;
