import axiosInstance from "../utils/axiosInstance";

export const getAcademicGrades = () => {
  return axiosInstance.get("/LookUpItems/AcademicGrades", {
    skipGlobalErrorHandler: true,
  });
};
