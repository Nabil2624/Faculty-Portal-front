import { useState, useEffect } from "react";
import { getPatents } from "../services/patents.service";

export default function usePatents(
  page = 1,
  pageSize = 9,
  search,
  filters,
  sortValue = 0,
) {
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getPatents(page, pageSize, search, sortValue, filters);
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
  }, [page, search, sortValue, filters]);

  return { items, totalPages, loading, error, loadData };
}
