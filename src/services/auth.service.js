import axiosInstance from "../utils/axiosInstance";


export const checkAuthMe = () => {
  return axiosInstance.get("/auth/authme", {
    skipGlobalErrorHandler: true
  });
};


export const getCurrentUser = async () => {
  return await axiosInstance.get("/Authentication/GetCurrentUser");
};


export const logout = async () => {
  return await axiosInstance.post("/Authentication/Logout");
};
