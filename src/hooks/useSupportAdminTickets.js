import { useState, useCallback } from "react";
import {
  getSupportAdminTickets,
  resolveTicket,
} from "../services/ticketing.service";

export const SUPPORT_PAGE_SIZE = 10;

export default function useSupportAdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTickets = useCallback(async (page = 1, filters = {}) => {
    setLoading(true);
    setError("");
    try {
      const res = await getSupportAdminTickets({
        ...filters,
        pageIndex: page,
        pageSize: SUPPORT_PAGE_SIZE,
      });
      setTickets(res.data || []);
      setTotalCount(res.totalCount || 0);
      setCurrentPage(page);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.title ||
          "Failed to load tickets.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const doResolve = useCallback(async (ticketId) => {
    await resolveTicket(ticketId);
  }, []);

  return {
    tickets,
    totalCount,
    loading,
    error,
    currentPage,
    fetchTickets,
    doResolve,
  };
}
