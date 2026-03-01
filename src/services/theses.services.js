import axiosInstance from "../utils/axiosInstance";
import qs from "qs";

export const addThesis = (data) => {
  return axiosInstance.post("/ResearchesAndTheses/AddTheses", data, {
    skipGlobalErrorHandler: true,
  });
};

export const getAcademicGrades = () => {
  return axiosInstance.get("/LookUpItems/AcademicGrades", {
    skipGlobalErrorHandler: true,
  });
};

export const getAcademicQualifications = () => {
  return axiosInstance.get("/LookUpItems/AcademicQualifications", {
    skipGlobalErrorHandler: true,
  });
};
export const getTheses = ({
  pageIndex,
  pageSize,
  search,
  sort,
  GradesID,
  Types,
}) => {
  return axiosInstance.get("/ResearchesAndTheses/Theses", {
    params: {
      pageIndex,
      pageSize,
      search,
      ...(sort && { sort }),

      ...(GradesID?.length && { GradesID }),
      ...(Types?.length && { Types }),
    },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
    skipGlobalErrorHandler: true,
  });
};

export const deleteThesis = (id) => {
  return axiosInstance.delete(`/ResearchesAndTheses/RemoveTheses/${id}`, {
    skipGlobalErrorHandler: true,
  });
};

export const getThesisById = (id) => {
  return axiosInstance.get(`/ResearchesAndTheses/Theses/${id}`, {
    skipGlobalErrorHandler: true,
  });
};

export const searchResearchByTitle = (title) => {
  return axiosInstance.get("/ResearchesAndTheses/ResearchFindByTitle", {
    params: { title },
    skipGlobalErrorHandler: true,
  });
};

export const getEmploymentDegrees = () => {
  return axiosInstance.get("/LookUpItems/EmploymentDegrees", {
    skipGlobalErrorHandler: true,
  });
};

export const getUniversities = () => {
  return axiosInstance.get("/LookUpItems/Universities", {
    skipGlobalErrorHandler: true,
  });
};

export const updateThesis = (id, data) => {
  return axiosInstance.put(`/ResearchesAndTheses/UpdateTheses/${id}`, data, {
    skipGlobalErrorHandler: true,
  });
};
export const getAuthorRole = () => {
  return axiosInstance.get("/LookUpItems/AcademicQualifications", {
    skipGlobalErrorHandler: true,
  });
};
