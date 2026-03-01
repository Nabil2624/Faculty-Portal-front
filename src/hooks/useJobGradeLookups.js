import { useState, useEffect } from "react";
import { getJobGradeLookups } from "../services/jobGrade.service";

export default function useJobGradeLookups() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const response = await getJobGradeLookups();
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

  return { items, loading, error }; 
}
