import axios, { AxiosError, AxiosHeaderValue, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

import { BASIC_URL } from "./Consts";
import { verifyRefreshToken } from "./api/userService/user";

export const userInstance = axios.create({
  baseURL: BASIC_URL,
});

export const adminInstance = axios.create({
  baseURL: BASIC_URL,
});

userInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

userInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status == 401) {
      try {
        console.log("creating new access token");

        await verifyRefreshToken();
        const newAccessToken = Cookies.get("accessToken");
        userInstance.defaults.headers["Authorization"] =
          newAccessToken as AxiosHeaderValue;
        return userInstance(error.config as AxiosRequestConfig);
      } catch (refreshError) {
        Cookies.remove("accessToken");
        localStorage.removeItem("refreshToken");

        return Promise.reject(error);
      }
    } else return Promise.reject(error);
  }
);
