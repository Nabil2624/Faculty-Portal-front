// services/academicQualifications.service.js
import axiosInstance from "../utils/axiosInstance";

export const getAcademicQualifications = async ({
  page = 1,
  pageSize = 9,
  search,
}) => {
  const response = await axiosInstance.get(
    "/ScientificProgression/AcademicQualifications",
    {
      params: { pageIndex: page, pageSize, search },
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
