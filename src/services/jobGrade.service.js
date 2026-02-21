import axiosInstance from "../utils/axiosInstance";

export const getJobRanks = async ({ page, pageSize, search }) => {
  const res = await axiosInstance.get("/ScientificProgression/JobRanks", {
    params: {
      pageIndex: page,
      pageSize,
      search,
    },
  });

  return res.data;
};

export const deleteJobRank = async (id) => {
  await axiosInstance.delete(`/ScientificProgression/DeleteJobRank/${id}`);
};
