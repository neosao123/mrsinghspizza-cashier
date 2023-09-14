import axios from "axios";
const base_url = process.env.REACT_APP_API;
export const publicApi = axios.create({
  baseURL: base_url,
});
