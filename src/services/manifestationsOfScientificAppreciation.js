import axiosInstance from "../utils/axiosInstance";
import qs from "qs";
export const getManifestations = (pageIndex, pageSize, search, sort) => {
  return axiosInstance.get("/Prizes/ManifestationsOfScientificAppreciation", {
    params: { pageIndex, pageSize, search, ...(sort && { sort }) },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
    skipGlobalErrorHandler: true,
  });
};

export const createManifestation = (data) => {
  return axiosInstance.post(
    "/Prizes/CreateManifestationOfScientificAppreciation",
    data,
    { skipGlobalErrorHandler: true },
  );
};

export const updateManifestation = (id, data) => {
  return axiosInstance.put(
    `/Prizes/UpdateManifestationOfScientificAppreciation/${id}`,
    data,
    { skipGlobalErrorHandler: true },
  );
};

export const deleteManifestation = (id) => {
  return axiosInstance.delete(
    `/Prizes/DeleteManifestationOfScientificAppreciation/${id}`,
    { skipGlobalErrorHandler: true },
  );
};


// services/manifestationsOfScientificAppreciation.js
export const uploadManifestationAttachments = async (entityId, files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  // context = 5 for Manifestation
  return axiosInstance.post(`/Attachments/${entityId}?context=5`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const downloadManifestationAttachment = async (entityId, attachmentId) => {
  return axiosInstance.get(`/Attachments/${entityId}/${attachmentId}?context=5`, {
    responseType: "blob",
  });
};

export const deleteManifestationAttachment = (entityId, attachmentId) => {
  return axiosInstance.delete(
    `/Attachments/${entityId}/${attachmentId}?context=5`
  );
};
