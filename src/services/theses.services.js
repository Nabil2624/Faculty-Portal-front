import axiosInstance from "../utils/axiosInstance";

export const getTheses = (pageIndex, pageSize) => {
  return axiosInstance.get("/ResearchesAndTheses/Theses", {
    params: { pageIndex, pageSize },
    skipGlobalErrorHandler: true,
  });
};

export const deleteThesis = (id) => {
  return axiosInstance.delete(`/ResearchesAndTheses/DeleteThesis/${id}`, {
    skipGlobalErrorHandler: true,
  });
};

export const getThesisById = (id) => {
  return axiosInstance.get(`/ResearchesAndTheses/Theses/${id}`, {
    skipGlobalErrorHandler: true,
  });
};
