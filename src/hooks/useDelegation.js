import { useState, useEffect } from "react";
import { getDelegationLookups } from "../services/academicQualifications.service";

export default function useDelegation() {
  const [types, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const response = await getDelegationLookups();
        setRoles(response?.data || []);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return { types, loading, error }; // ✅ مهم جداً
}
