import { useState, useEffect } from "react";
import { getManifestations } from "../services/manifestationsOfScientificAppreciation";

export default function useManifestations(page = 1, pageSize = 9) {
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getManifestations(page, pageSize);
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
  }, [page]);

  return { items, totalPages, loading, error, loadData };
}
