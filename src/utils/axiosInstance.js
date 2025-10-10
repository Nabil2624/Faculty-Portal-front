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
    const originalRequest = error.config;

    // 🧠 Case 1: No response — likely backend/network issue
    if (!error.response) {
      if (!originalRequest?.skipGlobalErrorHandler) {
        axiosEvent.dispatchEvent(
          new CustomEvent("axios-error", { detail: "/error/0" })
        );
      }
      return Promise.reject(error);
    }

    const { status } = error.response;

    // 🧠 Case 2: Expected user errors (no global error page)
    if (
      status === 400 || // validation error, wrong OTP, etc.
      status === 401 || // invalid credentials
      status === 409    // conflict (e.g. duplicate email)
    ) {
      return Promise.reject(error); // let component handle
    }

    // 🧠 Case 3: Real backend / DB / server-side / forbidden errors
    let targetRoute;
    switch (status) {
      case 403:
        targetRoute = "/error/403";
        break;
      case 404:
        targetRoute = "/error/404";
        break;
      case 500:
      default:
        // any 5xx error or unexpected error
        targetRoute = `/error/${status >= 500 ? 500 : status}`;
        break;
    }

    if (!originalRequest?.skipGlobalErrorHandler) {
      axiosEvent.dispatchEvent(
        new CustomEvent("axios-error", { detail: targetRoute })
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
