import { getResearchesDashboard } from "../services/dashboardAndReports.service";
import { useState, useEffect } from "react";

export function useDetailedDashboard() {
  const [researchesDashboard, setResearchesDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResearchesDashboard = async () => {
      try {
        setLoading(true);
        const response = await getResearchesDashboard();
        setResearchesDashboard(response?.data || response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResearchesDashboard();
  }, []);

  // نرجع Object عشان الوصول للقيم يكون أسهل وأوضح
  return { researchesDashboard, loading, error };
}