import axiosInstance from "../utils/axiosInstance";


export const getDashboard = () =>
  axiosInstance.get("/DashboardAndReports/Dashboard", { skipGlobalErrorHandler: true });