import { publicApi } from "../publicapis";

// Login Api
export const loginApi = async (payload) => {
  return await publicApi.post("cashier/login", payload);
};
