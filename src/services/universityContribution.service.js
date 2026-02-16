import axiosInstance from "../utils/axiosInstance";

export const getUniversityContribution = (pageIndex, pageSize) => {
  return axiosInstance.get("/Contributions/ContributionsToUniversity", {
    params: { pageIndex, pageSize },
    skipGlobalErrorHandler: true,
  });
}
export const createUniversityContribution = (data) => {
  return axiosInstance.post("/Contributions/CreateContributionToCommunityService", data, {
    skipGlobalErrorHandler: true,
  });
};
export const updateUniversityContribution = (id , data) => {
  return axiosInstance.put(`/Contributions/UpdateContributionToUniversity/${id}`, data, {
    skipGlobalErrorHandler: true,
  });
}
export const deleteUniversityContribution = (id ) => {
  return axiosInstance.delete(`/Contributions/DeleteContributionToUniversity/${id}`,
     {
    skipGlobalErrorHandler: true,
  });
};
export const getContributionTypeLookups = () => {
  return axiosInstance.get("/LookUpItems/ContributionTypes", {
    skipGlobalErrorHandler: true,
  });
}
