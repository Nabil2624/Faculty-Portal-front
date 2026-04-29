import { getDashboard } from "../services/dashboardAndReports.service";
import { useState, useEffect } from "react";

export function useDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await getDashboard();
        setDashboard(response?.data || response); 
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return { dashboard, error, loading };
}