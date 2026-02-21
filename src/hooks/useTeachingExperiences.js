// hooks/useGeneralExperience.js
import { useState, useEffect } from "react";
import { getTeachingExperience } from "../services/teachingExperiences.service";

export default function useTeachingExperiences(page = 1, pageSize = 9, search) {
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getTeachingExperience(page, pageSize ,search);
      const { data, totalCount } = res.data; 
      setItems(data || []);
      setTotalPages(Math.ceil(totalCount / pageSize) || 1);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page,search]);

  return { items, totalPages, loading, error, loadData };
}
