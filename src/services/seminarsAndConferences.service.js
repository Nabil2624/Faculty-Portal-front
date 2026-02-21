// services/seminarsAndConferences.service.js
import axiosInstance from "../utils/axiosInstance";

export const getSeminarsAndConferences = ({pageIndex, pageSize, search}) => {
  return axiosInstance.get("/Missions/ConferncesAndSeminars", {
    params: { pageIndex, pageSize, search },
    skipGlobalErrorHandler: true,
  });
};
export const deleteSeminarOrConference = async (id) => {
  await axiosInstance.delete(`/Missions/DeleteConferncesOrSeminars/${id}`, {
    skipGlobalErrorHandler: true,
  });
};
