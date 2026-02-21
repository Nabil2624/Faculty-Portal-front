import axiosInstance from "../utils/axiosInstance";
import qs from "qs";


export const getUniversityContribution = (
  pageIndex,
  pageSize,
  search,
  sort,
  TypeOfContributionIds,
) => {
  return axiosInstance.get("/Contributions/ContributionsToUniversity", {
    params: {
      pageIndex,
      pageSize,
      search,
      ...(sort && { sort }),
      ...(TypeOfContributionIds?.length && { TypeOfContributionIds }),
    },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
    skipGlobalErrorHandler: true,
  });
};
export const createUniversityContribution = (data) => {
  return axiosInstance.post(
    "/Contributions/CreateContributionToUniversity",
    data,
    {
      skipGlobalErrorHandler: true,
    },
  );
};
export const updateUniversityContribution = (id, data) => {
  return axiosInstance.put(
    `/Contributions/UpdateContributionToUniversity/${id}`,
    data,
    {
      skipGlobalErrorHandler: true,
    },
  );
};
export const deleteUniversityContribution = (id) => {
  return axiosInstance.delete(
    `/Contributions/DeleteContributionToUniversity/${id}`,
    {
      skipGlobalErrorHandler: true,
    },
  );
};
export const getContributionTypeLookups = () => {
  return axiosInstance.get("/LookUpItems/ContributionTypes", {
    skipGlobalErrorHandler: true,
  });
};
