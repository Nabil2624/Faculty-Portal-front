// services/academicQualifications.service.js
import axiosInstance from "../utils/axiosInstance";
import qs from "qs";
export const getAcademicQualifications = async ({
  page = 1,
  pageSize = 9,
  search,
  sort,
  QualificationIds,
  GradeIds,
  DispatchIds,
}) => {
  const response = await axiosInstance.get(
    "/ScientificProgression/AcademicQualifications",
    {
      params: {
        pageIndex: page,
        pageSize,
        search,
        ...(sort && { sort }),
        ...(QualificationIds?.length && { QualificationIds }),
        ...(GradeIds?.length && { GradeIds }),
        ...(DispatchIds?.length && { DispatchIds }),
      },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
      skipGlobalErrorHandler: true,
    },
  );

  const { data = [], totalCount = 0 } = response.data || {};
  return { data, totalCount };
};

export const deleteAcademicQualification = async (id) => {
  await axiosInstance.delete(
    `/ScientificProgression/DeleteAcademicQualification/${id}`,
    {
      skipGlobalErrorHandler: true,
    },
  );
};
export const getDelegationLookups = () => {
  return axiosInstance.get("/LookUpItems/AcademicQualifications", {
    skipGlobalErrorHandler: true,
  });
};
export const getDegreeLookups = () => {
  return axiosInstance.get("/LookUpItems/DispatchTypes", {
    skipGlobalErrorHandler: true,
  });
};
export const getGradeLookups = () => {
  return axiosInstance.get("/LookUpItems/AcademicGrades", {
    skipGlobalErrorHandler: true,
  });
};

export const downloadAcademicQualificationAttachment = async (
  entityId,
  attachmentId,
) => {
  return axiosInstance.get(
    `/Attachments/${entityId}/${attachmentId}?context=7`,
    { responseType: "blob" },
  );
};

// Upload Attachment
export const uploadAcademicQualificationAttachment = async (entityId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axiosInstance.post(`/Attachments/${entityId}?context=7`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Delete Attachment
export const deleteAcademicQualificationAttachment = async (
  entityId,
  attachmentId,
) => {
  return axiosInstance.delete(
    `/Attachments/${entityId}/${attachmentId}?context=7`,
  );
};


export const academicService = {
  getLookups: () => Promise.all([
    axiosInstance.get("/LookUpItems/AcademicGrades"),
    axiosInstance.get("/LookUpItems/DispatchTypes"),
    axiosInstance.get("/LookUpItems/AcademicQualifications"),
  ]),

  create: (data) => axiosInstance.post("/ScientificProgression/CreateAcademicQualification", data),
  
  update: (id, data) => axiosInstance.put(`/ScientificProgression/UpdateAcademicQualification/${id}`, data),

  uploadAttachment: (entityId, file) => {
    const formData = new FormData();
    formData.append("files", file);
    return axiosInstance.post(`/Attachments/${entityId}?context=7`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteAttachment: (entityId, attachmentId) => 
    axiosInstance.delete(`/Attachments/Delete/${entityId}/${attachmentId}?context=7`)
};