import axios from "axios";

const api = axios.create({
  baseURL:
    "https://ghostinbox09.onrender.com/api",

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});


// ============================================================
// ADD JWT TO EVERY REQUEST
// ============================================================

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


export default api;