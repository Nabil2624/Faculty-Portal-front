import { useState, useEffect } from "react";
import { getSupervisionTheses } from "../services/supervisionThesis.service";

export default function useSupervisionThesis(page, pageSize = 4) {
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getSupervisionTheses(page, pageSize);
      const { data, totalCount } = res.data;

      setItems(data || []);
      const calculatedTotalPages = Math.ceil(totalCount / pageSize);
      setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page]);

  return {
    items,
    totalPages,
    loading,
    error,
    loadData,
  };
}
