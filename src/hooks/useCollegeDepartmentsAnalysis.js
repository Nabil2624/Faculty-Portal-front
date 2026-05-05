import { useState, useCallback, useEffect } from "react";

import {
  getDepartmentResearchersDashboard,
  getDepartmentResearchesDashboard,
} from "../services/dashboardAndReports.service";

export const useCollegeDepartmentsAnalysis = (facultyId) => {

  // =========================
  // Department Researchers Data
  // =========================
  const [departmentResearchersData, setDepartmentResearchersData] = useState([]);
  const [departmentResearchersLoading, setDepartmentResearchersLoading] = useState(false);
  const [departmentResearchersError, setDepartmentResearchersError] = useState(null);

  // =========================
  // Department Researches Data
  // =========================
  const [departmentResearchesData, setDepartmentResearchesData] = useState([]);
  const [departmentResearchesLoading, setDepartmentResearchesLoading] = useState(false);
  const [departmentResearchesError, setDepartmentResearchesError] = useState(null);

  // =========================
  // Fetch Department Researchers
  // =========================
  const fetchDepartmentResearchers = useCallback(async () => {
    if (!facultyId) return;

    setDepartmentResearchersLoading(true);
    setDepartmentResearchersError(null);

    try {
      const response =
        await getDepartmentResearchersDashboard.getFaculties(facultyId);

      setDepartmentResearchersData(
        response.data?.data || response.data || []
      );
    } catch (err) {
      setDepartmentResearchersError(err);
    } finally {
      setDepartmentResearchersLoading(false);
    }
  }, [facultyId]);

  // =========================
  // Fetch Department Researches
  // =========================
  const fetchDepartmentResearches = useCallback(async () => {
    if (!facultyId) return;

    setDepartmentResearchesLoading(true);
    setDepartmentResearchesError(null);

    try {
      const response =
        await getDepartmentResearchesDashboard.getFaculties(facultyId);

      setDepartmentResearchesData(
        response.data?.data || response.data || []
      );
    } catch (err) {
      setDepartmentResearchesError(err);
    } finally {
      setDepartmentResearchesLoading(false);
    }
  }, [facultyId]);

  // =========================
  // Auto Fetch on facultyId change
  // =========================
  useEffect(() => {
    if (facultyId) {
      fetchDepartmentResearchers();
      fetchDepartmentResearches();
    }
  }, [facultyId, fetchDepartmentResearchers, fetchDepartmentResearches]);

  return {
    // =========================
    // Department Researchers
    // =========================
    departmentResearchersData,
    departmentResearchersLoading,
    departmentResearchersError,

    // =========================
    // Department Researches
    // =========================
    departmentResearchesData,
    departmentResearchesLoading,
    departmentResearchesError,
  };
};