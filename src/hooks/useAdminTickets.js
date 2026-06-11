import { useState, useCallback } from "react";
import {
  getAllTickets,
  getSuitableSupportAdmins,
  assignTicket,
  closeTicketAdmin,
  deleteTicket,
} from "../services/ticketing.service";

export const ADMIN_PAGE_SIZE = 10;

export default function useAdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTickets = useCallback(async (page = 1, filters = {}) => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllTickets({
        ...filters,
        pageIndex: page,
        pageSize: ADMIN_PAGE_SIZE,
        skipGlobalErrorHandler: true,
      });
      setTickets(res.data || []);
      setTotalCount(res.totalCount || 0);
      setCurrentPage(page);
    } catch (err) {
      if (err?.response?.status === 403) {
        setError("permissionDenied");
        return;
      }
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.title ||
          "Failed to load tickets.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSuitableAdmins = useCallback(async (ticket) => {
    return getSuitableSupportAdmins(ticket.type, {
      skipGlobalErrorHandler: true,
    });
  }, []);

  const doAssign = useCallback(async (ticketId, body) => {
    await assignTicket(ticketId, body, { skipGlobalErrorHandler: true });
  }, []);

  const doClose = useCallback(async (ticketId) => {
    await closeTicketAdmin(ticketId, { skipGlobalErrorHandler: true });
  }, []);

  const doDelete = useCallback(async (ticketId) => {
    await deleteTicket(ticketId, { skipGlobalErrorHandler: true });
  }, []);

  return {
    tickets,
    totalCount,
    loading,
    error,
    currentPage,
    fetchTickets,
    fetchSuitableAdmins,
    doAssign,
    doClose,
    doDelete,
  };
}
