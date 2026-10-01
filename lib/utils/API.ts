import axios from "axios";
import session from "./session";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
let access_token = session.get("access_token")


const API = axios.create({
  headers: {
    "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_APP_URL,
  },
  baseURL: API_URL,
  withCredentials: true,
});

API.interceptors.request.use(
  (config) => {    
    access_token = session.get("access_token")

    if (access_token !== null) {
      config.headers["Authorization"] = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

export default API;