import { useState, useEffect } from "react";
import { getResearcherProfile } from "../services/researcherProfileService";

export default function useResearcherProfile() {
  const [researcher, setResearcher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getResearcherProfile()
      .then((data) => {
        setResearcher(data);
        setError(null);
      })
      .catch((err) => setError(err.message || "Error fetching data"))
      .finally(() => setLoading(false));
  }, []);

  return { researcher, loading, error };
}
