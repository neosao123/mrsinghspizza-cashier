import { combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./cartReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer
});

export default rootReducer;
