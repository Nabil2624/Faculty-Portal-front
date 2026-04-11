import axiosInstance from "../utils/axiosInstance";

export const getCVData = () =>
  axiosInstance.get("/CV", { skipGlobalErrorHandler: true });

export const updateCVVisibility = (payload) =>
  axiosInstance.put("/CV/Manage-CV-Visibility", payload, {
    skipGlobalErrorHandler: true,
  });

export const downloadCV = (template, isPublic = false) =>
  axiosInstance.get("/CV/Download-Pdf", {
    params: { template, isPublic },
    responseType: "blob",
    skipGlobalErrorHandler: true,
  });

export const getTemplate = () =>
  axiosInstance.get("/CV/Get-Template", { skipGlobalErrorHandler: true });

export const previewCV = (template, isPublic = false) =>
  axiosInstance.get("/CV/Preview", {
    params: { template, isPublic },
    skipGlobalErrorHandler: true,
  });
