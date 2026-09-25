import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Attach Authorization header if valid token exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("cinefy_token");
  if (token && token !== "null" && token !== "undefined" && token.trim() !== "") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
