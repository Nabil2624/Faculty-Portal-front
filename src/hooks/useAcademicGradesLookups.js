import { useState, useEffect } from "react";
import { getAcademicGrades } from "../services/lookup.service";

export default function useAcademicGradesLookups() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const response = await getAcademicGrades();
        setTypes(response?.data || []);
 
        
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return { types, loading, error }; 
}
