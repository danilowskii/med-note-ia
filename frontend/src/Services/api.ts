import axios, { type AxiosInstance } from "axios";

const DEV_URL = import.meta.env.VITE_SERVER_DEV_URL;
const PROD_URL = import.meta.env.VITE_SERVER_PROD_URL;
const IS_PROD = import.meta.env.PROD;
//baseurl dinamica se é de prod ou dev
const BASEURL = IS_PROD ? PROD_URL : DEV_URL;
//importando axios e criando
const api: AxiosInstance = axios.create({
  baseURL: BASEURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
