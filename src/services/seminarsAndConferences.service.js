// services/seminarsAndConferences.service.js
import axiosInstance from "../utils/axiosInstance";
import qs from "qs";
export const getSeminarsAndConferences = ({
  pageIndex,
  pageSize,
  search,
  LocalOrInternational,
  ConferenceOrSeminar,
  RoleOfParticipationIds,
  sort
}) => {
  return axiosInstance.get("/Missions/ConferncesAndSeminars", {
    params: {
      pageIndex,
      pageSize,
      search,
      ...(sort && { sort }),
      ...(LocalOrInternational?.length && { LocalOrInternational }),
      ...(ConferenceOrSeminar?.length && { ConferenceOrSeminar }),
      ...(RoleOfParticipationIds?.length && { RoleOfParticipationIds }),
    },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
    skipGlobalErrorHandler: true,
  });
};
export const deleteSeminarOrConference = async (id) => {
  await axiosInstance.delete(`/Missions/DeleteConferncesOrSeminars/${id}`, {
    skipGlobalErrorHandler: true,
  });
};
export const getSeminarParticipationTypes = () => {
  return axiosInstance.get("/LookUpItems/SeminarParticipationTypes", {
    skipGlobalErrorHandler: true,
  });
};
