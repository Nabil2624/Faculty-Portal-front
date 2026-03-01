import { useState, useEffect } from "react";
import { getLookupsRewards } from "../services/prizesAndRewards.service";

export default function usePrizesAndRewardsLookups() {
  const [types, setTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [errorTypes, setErrorTypes] = useState(false);

  const loadTypes = async () => {
    try {
      setLoadingTypes(true);
      setErrorTypes(false);

      const res = await getLookupsRewards();
      setTypes(res?.data || []);
    } catch (err) {
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
