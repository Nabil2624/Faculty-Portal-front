import { useEffect, useState } from "react";
import { getPrizesAndRewards } from "../services/prizesAndRewards.service";

export default function usePrizesAndRewards(pageIndex, pageSize) {
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await getPrizesAndRewards(pageIndex, pageSize);

      const data = res.data;

      setItems(data.data || []);
      setTotalPages(Math.ceil(data.totalCount / pageSize) || 1);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [pageIndex]);

  return { items, totalPages, loading, error, loadData };
}
