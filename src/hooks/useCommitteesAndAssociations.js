import { useCallback, useEffect, useState } from "react";
import {
  getCommitteesAndAssociations,
  deleteCommitteeOrAssociation,
} from "../services/committees.service";

export default function useCommitteesAndAssociations({
  t,
  pageSize = 9,
  search,
  sortValue,
  typeOfCommitteeOrAssociationIds,
  degreeOfSubscriptionIds,
}) {
  const [committees, setCommittees] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const fetchCommittees = useCallback(
    async (page) => {
      setLoading(true);
      setError(null);

      try {
        const resp = await getCommitteesAndAssociations({
          pageIndex: page,
          pageSize,
          search,
          sort: sortValue,
          TypeOfCommitteeOrAssociationIds: typeOfCommitteeOrAssociationIds,
          DegreeOfSubscriptionIds: degreeOfSubscriptionIds,
        });

        const data = resp?.data ?? [];
        const totalCount = resp?.totalCount ?? 0;

        const pages = Math.max(1, Math.ceil(totalCount / pageSize));
        setTotalPages(pages);
        setCommittees(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setError(t("fetchError"));
        setCommittees([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [
      pageSize,
      t,
      search,
      sortValue,
      typeOfCommitteeOrAssociationIds,
      degreeOfSubscriptionIds,
    ],
  );

  // Refetch when page changes
  useEffect(() => {
    fetchCommittees(currentPage);
  }, [currentPage, fetchCommittees]);

  const deleteItem = async (id) => {
    try {
      setLoading(true);
      setError(null);

      await deleteCommitteeOrAssociation(id);

      // لو مسح آخر عنصر في الصفحة
      if (committees.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      } else {
        fetchCommittees(currentPage);
      }
    } catch (e) {
      console.error(e);
      setError(t("deleteError"));
    } finally {
      setLoading(false);
    }
  };

  return {
    committees,
    loading,
    error,

    // pagination API 👇
    currentPage,
    totalPages,
    setCurrentPage,

    // actions
    deleteItem,
    refetch: () => fetchCommittees(currentPage),
  };
}
