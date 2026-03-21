import axiosInstance from "../utils/axiosInstance";

export const getCVData = () =>
  axiosInstance.get("/CV", { skipGlobalErrorHandler: true });

export const updateCVVisibility = (payload) =>
  axiosInstance.put("/CV/Manage-CV-Visibility", payload, {
    skipGlobalErrorHandler: true,
  });
