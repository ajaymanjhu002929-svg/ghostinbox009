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

// ============================================================
// AUTHENTICATED FETCH
// ============================================================
// All protected requests should use this helper so both the
// httpOnly cookie (when available) and the JWT Authorization
// header are supported. This prevents auth from depending on
// one browser's cookie state.
export const authFetch = (input, init = {}) => {
  const token = localStorage.getItem("token");

  const headers = new Headers(
    init.headers || {}
  );

  if (token && !headers.has("Authorization")) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  return fetch(input, {
    ...init,
    credentials: "include",
    headers,
  });
};
