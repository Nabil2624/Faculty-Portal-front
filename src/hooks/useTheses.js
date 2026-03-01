import { useState, useEffect } from "react";
import { getTheses } from "../services/theses.services";

export default function useTheses(page, pageSize = 4, search, sortValue, gradeIds, type) {
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const loadData = async () => {
    if (!initialLoadDone) setLoading(true);
    setError(null);

    try {
      const res = await getTheses({page, pageSize, search, sort: sortValue, GradesID:gradeIds, Types: type});

      const { data, totalCount } = res.data;

      setItems(data || []);

      // FIX: prevent
      const calculatedPages =
        totalCount && pageSize ? Math.ceil(totalCount / pageSize) : 0;

      setTotalPages(calculatedPages > 0 ? calculatedPages : 1);
    } catch (err) {
      setError(err);
    } finally {
      setInitialLoadDone(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, search, sortValue, gradeIds, type]);

  return {
    items,
    totalPages,
    loading,
    error,
    loadData,
  };
}
