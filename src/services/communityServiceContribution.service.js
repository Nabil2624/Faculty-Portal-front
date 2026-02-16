import axiosInstance from "../utils/axiosInstance";

export const getCommunityServiceContribution = (pageIndex, pageSize) => {
  return axiosInstance.get("/Contributions/ContributionsToCommunityService", {
    params: { pageIndex, pageSize },
    skipGlobalErrorHandler: true,
  });
}
export const createCommunityServiceContribution = (data) => {
  return axiosInstance.post("/Contributions/CreateContributionToCommunityService", data, {
    skipGlobalErrorHandler: true,
  });
};
export const updateCommunityServiceContribution = (id , data) => {
  return axiosInstance.put(`/Contributions/UpdateContributionToCommunityService/${id}`, data, {
    skipGlobalErrorHandler: true,
  });
}
export const deleteCommunityServiceContribution = (id ) => {
  return axiosInstance.delete(`/Contributions/DeleteContributionToCommunityService/${id}`,
     {
    skipGlobalErrorHandler: true,
  });
};

