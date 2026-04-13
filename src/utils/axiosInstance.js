import axios from "axios";

// Event system
export const axiosEvent = new EventTarget();

//const BASE_URL = "https://localhost:7184/api";
const BASE_URL = "http://localhost/core";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ❌ Network error
    if (!error.response) {
      if (!originalRequest?.skipGlobalErrorHandler) {
        axiosEvent.dispatchEvent(
          new CustomEvent("axios-error", {
            detail: "network-error",
          })
        );
      }
      return Promise.reject(error);
    }

    const { status } = error.response;

    // 🔥 SESSION EXPIRED (401)
    if (status === 401) {
      axiosEvent.dispatchEvent(
        new CustomEvent("axios-error", {
          detail: "session-expired",
        })
      );

      return Promise.reject(error);
    }

    // Validation errors (local handling)
    if (status === 400 || status === 409) {
      return Promise.reject(error);
    }

    let targetRoute = null;

    switch (status) {
      case 403:
        targetRoute = "/error/403";
        break;

      case 404:
        if (!originalRequest?.skipGlobalErrorHandler) {
          targetRoute = "/error/404";
        }
        break;

      default:
        if (status >= 500) {
          targetRoute = "/error/500";
        }
        break;
    }

    if (targetRoute && !originalRequest?.skipGlobalErrorHandler) {
      axiosEvent.dispatchEvent(
        new CustomEvent("axios-error", {
          detail: targetRoute,
        })
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;