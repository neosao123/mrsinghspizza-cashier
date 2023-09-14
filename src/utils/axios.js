import axios from "axios";

import origin from "axios";

export const baseURL = process.env.REACT_APP_API;
export const axios = origin.create({
  baseURL,
});

axios.interceptors.request.use(async (config) => {
  await store.dispatch(startLoading());

  //   const token = await sessionStorage.getItem("smbToken");
  if (token) {
    // config.headers["Authorization"] = "Bearer " + token;
  }

  return config;
});

axios.interceptors.response.use(async (res) => {
  //   await store.dispatch(stopLoading());
  return res;
});
export default axios;
