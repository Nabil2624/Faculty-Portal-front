import axios from "axios";
import { createBrowserHistory } from "history";

// Create browser history to allow redirects from outside React components
export const history = createBrowserHistory();

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ✅ Request Interceptor: add auth token if present
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor: redirect on error
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          localStorage.removeItem("authToken");
          history.push("/login");
          break;
        case 404:
          history.push("/error/404");
          break;
        case 500:
          history.push("/error/500");
          break;
        default:
          history.push(`/error/${status}`);
          break;
      }
    } else {
      // Network or unknown error
      history.push("/error/0");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
