import axiosInstance from "../utils/axiosInstance";
import qs from "qs";
export const fetchRecommendedSupervisions = (
  pageIndex = 1,
  pageSize = 4,
  search,
  sort,
  GradeIds,
  Role,
  Type,
) => {
  return axiosInstance.get(
    "/ResearchesAndTheses/RecommendedThesesSupervisions",
    {
      params: {
        pageIndex,
        pageSize,
        search,
        ...(sort && { sort }),
        ...(GradeIds?.length && { GradeIds }),
        ...(Role?.length && { Role }),
        ...(Type?.length && { Type }),
      },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
      skipGlobalErrorHandler: true,
    },
  );
};

export const approveRecommendedSupervision = (id) => {
  return axiosInstance.put(
    `/ResearchesAndTheses/AcceptRecommendedThesesSupervision/${id}`,
  );
};

export const rejectRecommendedSupervision = (id) => {
  return axiosInstance.delete(
    `/ResearchesAndTheses/RejectRecommendedThesesSupervison/${id}`,
  );
};
