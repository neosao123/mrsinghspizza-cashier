import axios from "axios";
const base_url = process.env.REACT_APP_API;
export default {
  async sendPostApi(url, data) {
    const token = localStorage.getItem("token");
    const uri = base_url + url;
    const result = await axios.post(uri, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      withCredentials: false,
    });
    return result;
  },

  async sendGetApi(url, data) {
    const token = localStorage.getItem("token");
    const uri = base_url + url;
    const result = await axios.get(uri, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      withCredentials: false,
    });
    return result;
  },
};
