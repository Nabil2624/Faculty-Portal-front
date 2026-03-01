import { useState, useEffect } from "react";
import { getSeminarParticipationTypes } from "../services/seminarsAndConferences.service";

export default function useSeminarParticipationType() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const response = await getSeminarParticipationTypes();
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
