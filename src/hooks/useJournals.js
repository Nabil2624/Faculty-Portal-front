import { useState, useEffect } from "react";
import { getParticipationJournals } from "../services/participationJournals.service";

export default function useJournals(page, pageSize = 9) {
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const res = await getParticipationJournals(page, pageSize);
    const { data, totalCount } = res.data;
    setItems(data || []);
    setTotalPages(Math.ceil(totalCount / pageSize));
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [page]);

  return { items, totalPages, loading, loadData };
}
