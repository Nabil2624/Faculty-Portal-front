import { useState, useCallback } from "react";
import { getFacultyTopResearchersDashboard } from "../services/dashboardAndReports.service";

export const useTopResearchers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTopResearchers = useCallback(async (facultyId) => {
    if (!facultyId) return;

    setLoading(true);
    setError(null);

    try {
      const response =
        await getFacultyTopResearchersDashboard.getFaculties(facultyId);

      // ⚠️ عدل حسب شكل الريسبونس
      setData(response.data?.data || response.data || []);
    } catch (err) {
      setError(err);
      console.error("Error fetching top researchers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchTopResearchers };
};