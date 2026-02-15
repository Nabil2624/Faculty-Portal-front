import axios from "axios";

export const axiosEvent = new EventTarget();

const BASE_URL = "https://localhost:7184/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials : true ,
});

axiosInstance.interceptors.response.use(
  response => response,
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

    // Refresh token flow
    // if (status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   try {
    //     // Backend should send Set-Cookie for refresh token
    //     await axiosInstance.post("/auth/refresh-token", {}, { withCredentials: true });
    //     return axiosInstance(originalRequest);
    //   } catch (refreshError) {
    //     alert("⚠️ Your session has expired. Please login again.");
    //     window.location.href = "/login";
    //     return Promise.reject(refreshError);
    //   }
    // }

    // Handle validation or conflict errors
    if (status === 400 || status === 409) return Promise.reject(error);

    // Handle other errors
    let targetRoute;
    switch (status) {
      case 403: targetRoute = "/error/403"; break;
      case 404: targetRoute = "/error/404"; break;
      case 500:
      default: targetRoute = `/error/${status >= 500 ? 500 : status}`; break;
    }

   if (
  status === 400 || 
  status === 409 || 
  (status === 404 && originalRequest?.skipGlobalErrorHandler)
) {
  return Promise.reject(error); 
}

    return Promise.reject(error);
  }
);

export default axiosInstance;
