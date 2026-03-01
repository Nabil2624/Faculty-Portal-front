import { useState, useEffect } from "react";
import { getDegreeLookups } from "../services/academicQualifications.service";

export default function useDegreeLookup() {
  const [lookups, setLookups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const response = await getDegreeLookups();
        setLookups(response?.data || []);
        console.log(response.data);
        
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return { lookups, loading, error }; // ✅ مهم جداً
}
