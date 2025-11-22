// utils/axiosInstance.js
import axios from "axios";

export const axiosEvent = new EventTarget();

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://localhost:7098/api",
  headers: { "Content-Type": "application/json" },
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

// ✅ Response interceptor for refresh + session handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      if (!originalRequest?.skipGlobalErrorHandler) {
        axiosEvent.dispatchEvent(
          new CustomEvent("axios-error", { detail: "/error/0" })
        );
      }
      return Promise.reject(error);
    }

    const { status } = error.response;

    // 🔹 401 Unauthorized: try refresh token
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const refreshResponse = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL || "https://localhost:7098/api"}/auth/refresh-token`,
            { token: refreshToken }
          );

          const newToken = refreshResponse.data.token;
          localStorage.setItem("authToken", newToken);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Refresh failed -> logout
          alert("⚠️ Your session has expired. Please login again.");
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token -> force login
        alert("⚠️ Your session has expired. Please login again.");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    // 🔹 Expected user errors — let component handle
    if (status === 400 || status === 409) {
      return Promise.reject(error);
    }

    // 🔹 Global error pages
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
