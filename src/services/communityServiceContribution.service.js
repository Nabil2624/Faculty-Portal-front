import axiosInstance from "../utils/axiosInstance";
import qs from "qs";
export const getCommunityServiceContribution = (
  pageIndex,
  pageSize,
  sort,
  search,
) => {
  return axiosInstance.get("/Contributions/ContributionsToCommunityService", {
    params: { pageIndex, pageSize, search, ...(sort && { sort }) },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
    skipGlobalErrorHandler: true,
  });
};
export const createCommunityServiceContribution = (data) => {
  return axiosInstance.post(
    "/Contributions/CreateContributionToCommunityService",
    data,
    {
      skipGlobalErrorHandler: true,
    },
  );
};
export const updateCommunityServiceContribution = (id, data) => {
  return axiosInstance.put(
    `/Contributions/UpdateContributionToCommunityService/${id}`,
    data,
    {
      skipGlobalErrorHandler: true,
    },
  );
};
export const deleteCommunityServiceContribution = (id) => {
  return axiosInstance.delete(
    `/Contributions/DeleteContributionToCommunityService/${id}`,
    {
      skipGlobalErrorHandler: true,
    },
  );
};
