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
