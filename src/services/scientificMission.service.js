import axiosInstance from "../utils/axiosInstance";
import qs from "qs";
export const getScientificMissions = async ({
  page = 1,
  pageSize = 9,
  search,
  sort,
}) => {
  const response = await axiosInstance.get("/Missions/ScientificMissions", {
    params: {
      pageIndex: page,
      pageSize,
      search,
      ...(sort && { sort }),
    },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
    skipGlobalErrorHandler: true,
  });
  return response.data;
};

export const deleteScientificMission = async (id) => {
  return axiosInstance.delete(`/Missions/DeleteScientificMission/${id}`, {
    skipGlobalErrorHandler: true,
  });
};
