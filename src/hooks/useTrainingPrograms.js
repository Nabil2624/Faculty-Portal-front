// hooks/useTrainingPrograms.js
import { useState, useEffect, useCallback } from "react";
import { getTrainingPrograms } from "../services/trainingPrograms.service";

export default function useTrainingPrograms(
  page = 1,
  pageSize = 9,
  search
) {
  const [programs, setPrograms] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(
    async (pageToLoad = page) => {
      setLoading(true);
      setError(null);

      try {
        const res = await getTrainingPrograms({
          page: pageToLoad,
          pageSize,
          search,
        });

        const { data = [], totalCount = 0 } = res || {};

        setPrograms(data);
        setTotalPages(Math.ceil(totalCount / pageSize) || 1);
      } catch (err) {
        setError("Failed to load training programs");
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, search]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { programs, totalPages, loading, error, loadData };
}