import { useState, useEffect, useCallback } from "react";
import { getAdminPosition } from "../services/adminstrativePosition.service";

export default function useAdminPosition(
  page = 1,
  pageSize = 9,
  search,
  sortValue,
) {
  const [jobRanks, setJobRanks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(
    async (pageToLoad = page) => {
      setLoading(true);
      setError(null);

      try {
        const res = await getAdminPosition({
          page: pageToLoad,
          pageSize,
          search,
          sort: sortValue,
        });

        const { data = [], totalCount = 0 } = res || {};

        setJobRanks(data);
        setTotalPages(Math.ceil(totalCount / pageSize) || 1);
      } catch (err) {
        console.error(err);
        setError("Failed to load job grades");
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, search, sortValue],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    jobRanks,
    totalPages,
    loading,
    error,
    loadData,
  };
}
