import { useState, useEffect } from "react";
import { getContributionTypeLookups } from "../services/universityContribution.service";

export default function useContributionTypeLookups() {
  const [types, setTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [errorTypes, setErrorTypes] = useState(false);

  const loadTypes = async () => {
    try {
      setLoadingTypes(true);
      setErrorTypes(false);

      const res = await getContributionTypeLookups();
      setTypes(res?.data || []);
    } catch (err) {
      console.error("Contribution types error:", err);
      setErrorTypes(true);
    } finally {
      setLoadingTypes(false);
    }
  };

  useEffect(() => {
    loadTypes();
  }, []);

  return {
    types,
    loadingTypes,
    errorTypes,
    reloadTypes: loadTypes,
  };
}
