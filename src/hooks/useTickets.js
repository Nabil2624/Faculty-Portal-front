import { useState, useEffect, useCallback } from "react";
import { getMyTickets } from "../services/ticketing.service";

export default function useTickets({
  page = 1,
  pageSize = 10,
  search = "",
  sort = "",
  type = "",
  status = "",
  priority = "",
} = {}) {
  const [tickets, setTickets] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyTickets({
        search,
        sort,
        type,
        status,
        priority,
        pageIndex: page,
        pageSize,
      });
      setTickets(data.data || []);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      setError(err?.message || "Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, sort, type, status, priority]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return { tickets, totalCount, totalPages, loading, error, refresh: loadData };
}
