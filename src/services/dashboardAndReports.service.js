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

export const getOverallSystemPerformanceReportPreview = (notes = "") =>
  axiosInstance.get(
    "/DashboardAndReports/OverallSystemPerformanceReportPreview",
    {
      params: { notes },
      skipGlobalErrorHandler: true,
    },
  );

export const downloadGeneralSystemReportPdf = (notes = "") =>
  axiosInstance.get("/DashboardAndReports/DownloadGeneralSystemReportPdf", {
    params: { notes },
    responseType: "blob",
    skipGlobalErrorHandler: true,
  });

export const getFacultyResearchesAndResearchersReportPreview = (
  facultyId,
  notes = "",
) =>
  axiosInstance.get(
    "/DashboardAndReports/FacultyResearchesAndResearchersReportPreview",
    {
      params: {
        FacultyIdFacultyResearchesReportPreview: facultyId,
        notes,
      },
      skipGlobalErrorHandler: true,
    },
  );

export const downloadFacultyResearchesReportPdf = (facultyId, notes = "") =>
  axiosInstance.get("/DashboardAndReports/DownloadFacultyResearchesReportPdf", {
    params: { facultyId, notes },
    responseType: "blob",
    skipGlobalErrorHandler: true,
  });

export const getTotalUniversityResearchesReportPreview = (notes = "") =>
  axiosInstance.get(
    "/DashboardAndReports/TotalUniversityResearchesReportPreview",
    {
      params: { notes },
      skipGlobalErrorHandler: true,
    },
  );

export const downloadResearchesReportPdf = (notes = "") =>
  axiosInstance.get("/DashboardAndReports/DownloadResearchesReportPdf", {
    params: { notes },
    responseType: "blob",
    skipGlobalErrorHandler: true,
  });
