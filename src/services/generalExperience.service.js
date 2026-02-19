import axiosInstance from "../utils/axiosInstance";

export const getGeneralExperience = (pageIndex, pageSize, search) => {
  return axiosInstance.get("/Experiences/GeneralExperiences", {
    params: { pageIndex, pageSize, search },
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
