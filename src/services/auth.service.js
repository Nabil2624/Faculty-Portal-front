import axiosInstance from "../utils/axiosInstance";


export const checkAuthMe = () => {
  return axiosInstance.get("/Authentication/AuthMe", {
    skipGlobalErrorHandler: true
  });
};


export const getCurrentUser = async () => {
  return await axiosInstance.get("/Authentication/GetCurrentUser");
};


export const logout = async () => {
  return await axiosInstance.post("/Authentication/Logout");
};
