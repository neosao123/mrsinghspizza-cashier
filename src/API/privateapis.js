import axios from "axios";

const base_url = process.env.REACT_APP_API;
const token = localStorage.getItem("token");

export const privateAPi = axios.create({
  baseURL: base_url,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  },
  withCredentials: false,
});
