import axiosInstance from "../utils/axiosInstance";

export const getCurrentUser = async () => {
  return await axiosInstance.get("/Authentication/GetCurrentUser");
};