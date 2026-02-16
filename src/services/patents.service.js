import axiosInstance from "../utils/axiosInstance";

export const getPatents = (pageIndex, pageSize) => {
  return axiosInstance.get("/WritingsAndPatents/Patents", {
    params: { pageIndex, pageSize },
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
