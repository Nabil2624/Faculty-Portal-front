import { useState, useEffect } from "react";
import { getAuthorRole } from "../services/scientific-writing.service";

export default function useAuthorRoles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const response = await getAuthorRole();
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

  return { roles, loading, error }; // ✅ مهم جداً
}
