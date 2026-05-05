import axiosInstance from "../utils/axiosInstance";

export const getDashboard = () =>
  axiosInstance.get("/DashboardAndReports/Dashboard", {
    skipGlobalErrorHandler: true,
  });

export const getResearchesDashboard = () =>
  axiosInstance.get("/DashboardAndReports/ResearchesDashboard", {
    skipGlobalErrorHandler: true,
  });

export const UniversityService = {
  getFaculties: () =>
    axiosInstance.get("/LookUpItems/UniversityFaculties", {
      skipGlobalErrorHandler: true,
    }),
};
export const getFacultyTopResearchersDashboard = {
  getFaculties: (FacultyId) =>
    axiosInstance.get("/DashboardAndReports/FacultyTopResearchersDashboard", {
      params: {
        FacultyIdTopFiveResearchers: FacultyId,
      },
      skipGlobalErrorHandler: true,
    }),
};
export const getDepartmentResearchersDashboard = {
  getFaculties: (FacultyId) =>
    axiosInstance.get("/DashboardAndReports/DepartmentResearchersDashboard", {
      params: {
        FacultyIdDepartmentResearchers: FacultyId,
      },
      skipGlobalErrorHandler: true,
    }),
};
export const getDepartmentResearchesDashboard = {
  getFaculties: (FacultyId) =>
    axiosInstance.get("/DashboardAndReports/DepartmentResearchesDashboard", {
      params: {
        FacultyIdDepartmentResearches: FacultyId,
      },
      skipGlobalErrorHandler: true,
    }),
};
