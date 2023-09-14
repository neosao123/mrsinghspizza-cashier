import axios from "axios";
import { privateAPi } from "./privateapis";

export const orderListApi = async (payload) => {
  return await privateAPi.post("/cashier/order/list", payload);
};
export const orderDetails = async (payload) => {
  return await privateAPi.post("/cashier/order/details", payload);
};
export const changeDeliveryExecutive = async (payload) => {
  return await privateAPi.post(
    "/cashier/order/assignDeliveryExecutive",
    payload
  );
};
export const allDeliveryExecutiveApi = async () => {
  return await privateAPi.get("/delivery-executive");
};
export const statusChange = async (payload) => {
  return await privateAPi.post("/cashier/order/statuschange", payload);
};
