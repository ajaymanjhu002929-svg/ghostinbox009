
import axios from "axios";

const api = axios.create({
  baseURL: "https://ghostinbox09.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

