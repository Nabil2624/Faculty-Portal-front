import axiosInstance from "../utils/axiosInstance";

export const getScientificMissions = async ({ page = 1, pageSize = 9, search }) => {
  const response = await axiosInstance.get("/Missions/ScientificMissions", {
    params: {
      pageIndex: page,
      pageSize,
      search
    },
    skipGlobalErrorHandler: true,
  });
  return response.data;
};

export const deleteScientificMission = async (id) => {
  return axiosInstance.delete(`/Missions/DeleteScientificMission/${id}`, {
    skipGlobalErrorHandler: true,
  });
};
