import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://portfolio-backend-d0we.onrender.com/api"
    : "http://localhost:5000/api");

export const API = axios.create({
  baseURL: API_BASE_URL,
});