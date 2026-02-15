import axiosInstance from "../utils/axiosInstance";

export const getUniversityContribution = (pageIndex, pageSize) => {
  return axiosInstance.get("/Contributions/ContributionsToUniversity", {
    params: { pageIndex, pageSize },
    skipGlobalErrorHandler: true,
  });
}
export const createUniversityContribution = (data) => {
  return axiosInstance.post("/Contributions/CreateContributionToUniversity", data, {
    skipGlobalErrorHandler: true,
  });
};
export const updateUniversityContribution = (id , data) => {
  return axiosInstance.put(`/Contributions/UpdateContributionToUniversity/${contributionId}`, data, {
    skipGlobalErrorHandler: true,
  });
}
export const deleteUniversityContribution = (id ) => {
  return axiosInstance.delete(`/Contributions/DeleteContributionToUniversity/${id}`,
     {
    skipGlobalErrorHandler: true,
  });
};