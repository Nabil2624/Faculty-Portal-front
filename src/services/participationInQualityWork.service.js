import axiosInstance from "../utils/axiosInstance";
import qs from "qs";
export const getParticipation = (pageIndex, pageSize, sort, search) => {
  return axiosInstance.get("/Contributions/ParticipationsInQualityWorks", {
    params: { pageIndex, pageSize, search, ...(sort && { sort }) },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
    skipGlobalErrorHandler: true,
  });
};
export const createParticipation = (data) => {
  return axiosInstance.post(
    "/Contributions/CreateParticipationInQualityWorks",
    data,
    {
      skipGlobalErrorHandler: true,
    },
  );
};
export const updateParticipation = (id, data) => {
  return axiosInstance.put(
    `/Contributions/UpdateParticipationInQualityWorks/${id}`,
    data,
    {
      skipGlobalErrorHandler: true,
    },
  );
};
export const deleteParticipation = (id) => {
  return axiosInstance.delete(
    `/Contributions/DeleteParticipationInQualityWorks/${id}`,
    {
      skipGlobalErrorHandler: true,
    },
  );
};
