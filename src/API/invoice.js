import React from "react";
import { privateAPi } from "./privateapis";

export const getInvoicesList = async (payload) => {
  return await privateAPi.post("/invoice/list", payload);
};
