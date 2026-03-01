import axiosInstance from "../utils/axiosInstance";

export const fetchRecommendedSupervisions = (pageIndex = 1, pageSize = 4) => {
  return axiosInstance.get("/ResearchesAndTheses/RecommendedSupervisions", {
    params: { pageIndex, pageSize },
    skipGlobalErrorHandler: true,
  });
};

export const approveRecommendedSupervision = (id) => {
  return axiosInstance.put(
    `/ResearchesAndTheses/ApproveRecommendedSupervision/${id}`,
    { skipGlobalErrorHandler: true },
  );
};

export const rejectRecommendedSupervision = (id) => {
  return axiosInstance.delete(
    `/ResearchesAndTheses/RejectRecommendedSupervision/${id}`,
    { skipGlobalErrorHandler: true },
  );
};
