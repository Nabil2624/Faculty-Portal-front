// hooks/useGeneralExperience.js
import { useState, useEffect } from "react";
import { getTeachingExperience } from "../services/teachingExperiences.service";

export default function useGeneralExperiences(page = 1, pageSize = 9) {
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getTeachingExperience(page, pageSize);
      const { data, totalCount } = res.data; // زي Journals
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
  }, [page]);

  return { items, totalPages, loading, error, loadData };
}
