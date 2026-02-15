import axiosInstance from "../utils/axiosInstance";

export const getTeachingExperience = (pageIndex, pageSize) => {
  return axiosInstance.get("/Experiences/TeachingExperiences", {
    params: { pageIndex, pageSize },
    skipGlobalErrorHandler: true,
  });
}
export const createTeachingExperience = (data) => {
  return axiosInstance.post("/Experiences/CreateTeachingExperience", data, {
    skipGlobalErrorHandler: true,
  });
};
export const updateTeachingExperience = (id , data) => {
  return axiosInstance.put(`/Experiences/UpdateTeachingExperience/${id}`, data, {
    skipGlobalErrorHandler: true,
  });
}
export const deleteTeachingExperience = (id ) => {
  return axiosInstance.delete(`/Experiences/DeleteTeachingExperience/${id}`,
     {
    skipGlobalErrorHandler: true,
  });
};