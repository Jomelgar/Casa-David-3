import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

import { PORT_API, URL_HOSTING } from "../config";

const url = (process.env.NODE_ENV === "production") ? URL_HOSTING + "api/" : `http://localhost:${PORT_API}/api/`
const instance = axios.create({ baseURL: url });

instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const { response } = error;

    if (response.status === 403) {
      Cookies.remove("token");

      window.location.href = "/auth/";
    }

    return Promise.reject(error);
  }
);

export default instance;
