import axios from "axios";

const API = axios.create({
  baseURL:  import.meta.env.VITE_API_URL,
});

// Request interceptor to automatically attach Authorization header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration / 401 unauthorized
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If we get an unauthorized error, clear session if token is invalid
      const currentPath = window.location.pathname;
      if (currentPath !== "/" && currentPath !== "/register") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default API;