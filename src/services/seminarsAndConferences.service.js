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


export const downloadSeminarAttachment = async (entityId, attachmentId) => {
  return axiosInstance.get(`/Attachments/${entityId}/${attachmentId}?context=8`, {
    responseType: "blob",
  });
};


// UPLOAD
export const uploadSeminarAttachments = async (entityId, files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  return axiosInstance.post(
    `/Attachments/${entityId}?context=8`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

// DELETE
export const deleteSeminarAttachment = async (
  entityId,
  attachmentId
) => {
  return axiosInstance.delete(
    `/Attachments/${entityId}/${attachmentId}?context=8`
  );
};


export const conferenceService = {
  create: (data) => axiosInstance.post("/Missions/CreateConfernceOrSeminar", data),
  update: (id, data) => axiosInstance.put(`/Missions/UpdateConferncesOrSeminars/${id}`, data),
  getRoles: () => axiosInstance.get("/LookUpItems/SeminarParticipationTypes"),
};