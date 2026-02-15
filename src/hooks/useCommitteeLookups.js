import { useEffect, useState } from "react";
import { getCommitteeLookups } from "../services/committees.service";

export default function useCommitteeLookups() {
  const [types, setTypes] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCommitteeLookups()
      .then(([typesRes, degreesRes]) => {
        setTypes(typesRes.data ?? []);
        setDegrees(degreesRes.data ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  return { types, degrees, loading };
}
