import axios, { type AxiosInstance } from "axios";

//baseurl dinamica se é de prod ou dev
const BASEURL = import.meta.env.VITE_API_URL;
//importando axios e criando
const api: AxiosInstance = axios.create({
  baseURL: BASEURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
