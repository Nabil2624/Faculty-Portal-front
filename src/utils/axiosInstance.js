// utils/axiosInstance.js
import axios from "axios";

// Create a small event target to emit errors
export const axiosEvent = new EventTarget();

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://localhost:7098/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ✅ Add Authorization header if token exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global error handling via custom event
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      let targetRoute;
      switch (status) {
        case 401:
          localStorage.removeItem("authToken");
          targetRoute = "/login";
          break;
        case 404:
          targetRoute = "/error/404";
          break;
        case 500:
          targetRoute = "/error/500";
          break;
        default:
          targetRoute = `/error/${status}`;
          break;
      }

      axiosEvent.dispatchEvent(
        new CustomEvent("axios-error", { detail: targetRoute })
      );
    } else {
      // Network error
      axiosEvent.dispatchEvent(
        new CustomEvent("axios-error", { detail: "/error/0" })
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
