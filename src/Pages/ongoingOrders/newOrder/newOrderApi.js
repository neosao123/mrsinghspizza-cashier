import AxiosPrivate from "../../../API/AxiosPrivate";
import { privateAPi } from "../../../API/privateapis";

export const allIngredientsApi = async () => {
  return await AxiosPrivate.sendGetApi("/getAllIngredients", {});
};
export const sidesApi = async () => {
  return await privateAPi.get("/sides");
};
export const isZipCodeDelivarable = async (payload) => {
  return await privateAPi.post("/zipcode/check/deliverable", {
    zipcode: payload.toString(),
  });
};