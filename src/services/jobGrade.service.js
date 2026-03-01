import axiosInstance from "../utils/axiosInstance";
import qs from "qs";
export const getJobRanks = async ({
  page,
  pageSize,
  search,
  sort,
  JobRankIds,
}) => {
  const res = await axiosInstance.get("/ScientificProgression/JobRanks", {
    params: {
      pageIndex: page,
      pageSize,
      search,
      ...(sort && { sort }),
      ...(JobRankIds?.length && { JobRankIds }),
    },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
    skipGlobalErrorHandler: true,
  });

  return res.data;
};

export const deleteJobRank = async (id) => {
  await axiosInstance.delete(`/ScientificProgression/DeleteJobRank/${id}`, {
    skipGlobalErrorHandler: true,
  });
};
export const getJobGradeLookups = () => {
  return axiosInstance.get("/LookUpItems/EmploymentDegrees", {
    skipGlobalErrorHandler: true,
  });
};
