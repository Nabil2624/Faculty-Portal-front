import axiosInstance from "../utils/axiosInstance";
import qs from "qs";
export const getTeachingExperience = (pageIndex, pageSize, search, sort) => {
  return axiosInstance.get("/Experiences/TeachingExperiences", {
    params: {
      pageIndex,
      pageSize,
      search,
      ...(sort && { sort }),
    },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
    skipGlobalErrorHandler: true,
  });
};

export const createTeachingExperience = (data) => {
  return axiosInstance.post("/Experiences/CreateTeachingExperience", data, {
    skipGlobalErrorHandler: true,
  });
};
export const updateTeachingExperience = (id, data) => {
  return axiosInstance.put(
    `/Experiences/UpdateTeachingExperience/${id}`,
    data,
    {
      skipGlobalErrorHandler: true,
    },
  );
};
export const deleteTeachingExperience = (id) => {
  return axiosInstance.delete(`/Experiences/DeleteTeachingExperience/${id}`, {
    skipGlobalErrorHandler: true,
  });
};
