import axiosInstance from "../utils/axiosInstance";
import qs from "qs";
export const getGeneralExperience = (pageIndex, pageSize, search, sort) => {
  return axiosInstance.get("/Experiences/GeneralExperiences", {
    params: { pageIndex, pageSize, search, ...(sort && { sort }) },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
    skipGlobalErrorHandler: true,
  });
};
export const createGeneralExperience = (data) => {
  return axiosInstance.post("/Experiences/CreateGeneralExperience", data, {
    skipGlobalErrorHandler: true,
  });
};
export const updateGeneralExperience = (id, data) => {
  return axiosInstance.put(`/Experiences/UpdateGeneralExperience/${id}`, data, {
    skipGlobalErrorHandler: true,
  });
};
export const deleteGeneralExperience = (id) => {
  return axiosInstance.delete(`/Experiences/DeleteGeneralExperience/${id}`, {
    skipGlobalErrorHandler: true,
  });
};
