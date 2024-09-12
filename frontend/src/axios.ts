import axios from "axios";
import { BASIC_URL } from "./Consts";

export const userInstance = axios.create({
  baseURL: BASIC_URL,
});

export const adminInstance = axios.create({
  baseURL: BASIC_URL,
});


