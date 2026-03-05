import axiosInstance from "../utils/axiosInstance";
import qs from "qs";
export const getPatents = (
  pageIndex,
  pageSize,
  search,
  sort,
  LocalOrInternational,
) => {
  return axiosInstance.get("/WritingsAndPatents/Patents", {
    params: {
      pageIndex,
      pageSize,
      search,
      ...(sort && { sort }),
      ...(LocalOrInternational?.length && { LocalOrInternational }),
    },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
    skipGlobalErrorHandler: true,
  });
};

export const createPatent = (data) => {
  return axiosInstance.post("/WritingsAndPatents/CreatePatent", data, {
    skipGlobalErrorHandler: true,
  });
};

export const updatePatent = (id, data) => {
  return axiosInstance.put(`/WritingsAndPatents/UpdatePatent/${id}`, data, {
    skipGlobalErrorHandler: true,
  });
};

export const deletePatent = (id) => {
  return axiosInstance.delete(`/WritingsAndPatents/DeletePatent/${id}`, {
    skipGlobalErrorHandler: true,
  });
};


// Upload attachments for a patent entity
export const uploadPatentAttachments = async (entityId, files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  // context = 4 (Patent)
  return axiosInstance.post(
    `/Attachments/${entityId}?context=4`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};

// Download a patent attachment
export const downloadPatentAttachment = async (entityId, attachmentId) => {
  return axiosInstance.get(
    `/Attachments/${entityId}/${attachmentId}?context=4`,
    { responseType: "blob" }
  );
};

export const deletePatentAttachment = (entityId, attachmentId) => {
  return axiosInstance.delete(
    `/Attachments/${entityId}/${attachmentId}?context=4`
  );
};