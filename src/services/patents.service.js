import axiosInstance from "../utils/axiosInstance";
import qs from "qs";
export const getPatents = (
  pageIndex,
  pageSize,
  search,
  sort,
  LocalOrInternational,
) => {
  return axiosInstance.get("/WritingsAndPatents/Patents", {
    params: {
      pageIndex,
      pageSize,
      search,
      ...(sort && { sort }),
      ...(LocalOrInternational?.length && { LocalOrInternational }),
    },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
    skipGlobalErrorHandler: true,
  });
};

export const createPatent = (data) => {
  return axiosInstance.post("/WritingsAndPatents/CreatePatent", data, {
    skipGlobalErrorHandler: true,
  });
};

export const updatePatent = (id, data) => {
  return axiosInstance.put(`/WritingsAndPatents/UpdatePatent/${id}`, data, {
    skipGlobalErrorHandler: true,
  });
};

export const deletePatent = (id) => {
  return axiosInstance.delete(`/WritingsAndPatents/DeletePatent/${id}`, {
    skipGlobalErrorHandler: true,
  });
};
