import axiosInstance from "../utils/axiosInstance";

export const fetchRecommendedSupervisions = (
  pageIndex = 1,
  pageSize = 4
) => {
  return axiosInstance.get("/ResearchesAndTheses/RecommendedThesesSupervisions", {
    params: { pageIndex, pageSize },
    skipGlobalErrorHandler: true,
  });
};

export const approveRecommendedSupervision = (id) => {
  return axiosInstance.put(
    `/ResearchesAndTheses/RecommendedThesesSupervisions${id}`
  );
};

export const rejectRecommendedSupervision = (id) => {
  return axiosInstance.delete(
    `/ResearchesAndTheses/RejectRecommendedThesesSupervison/${id}`
  );
};
