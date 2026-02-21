// hooks/useGeneralExperience.js
import { useState, useEffect } from "react";
import { getUniversityContribution } from "../services/universityContribution.service";

export default function useUniversityContribution(
  page = 1,
  pageSize = 9,
  search,
  sortValue = 0,
  filters,
) {
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getUniversityContribution(
        page,
        pageSize,
        search,
        sortValue,
        filters,
      );
      const { data, totalCount } = res.data; // زي Journals
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
