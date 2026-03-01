import { useState, useEffect } from "react";
import { getGradeLookups } from "../services/academicQualifications.service";

export default function useAcademicGrade() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const response = await getGradeLookups();
        setItems(response?.data || []);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return { items, loading, error }; // ✅ مهم جداً
}
