import { useState, useEffect, useCallback } from "react";
import {
  getLogs,
  getLogCount,
  getCategories,
  getActions,
  LOG_LEVEL_ENUM,
} from "../services/logs.service";

export default function useLogs({
  page,
  pageSize,
  search,
  levels,
  categories,
  categoryActions,
  codes,
  dateFrom,
  dateTo,
}) {
  const [logs, setLogs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [levelCounts, setLevelCounts] = useState({
    Information: 0,
    Warning: 0,
    Error: 0,
    Critical: 0,
  });
  const [categoriesList, setCategoriesList] = useState([]);
  const [actionsList, setActionsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories and actions once on mount
  useEffect(() => {
    Promise.all([getCategories(), getActions()])
      .then(([cats, acts]) => {
        setCategoriesList(cats);
        setActionsList(acts);
      })
      .catch(() => {});
  }, []);

  // Fetch global level counts once on mount
  useEffect(() => {
    Promise.all(
      Object.entries(LOG_LEVEL_ENUM).map(([name, num]) =>
        getLogCount(num).then((count) => [name, count]),
      ),
    )
      .then((entries) => setLevelCounts(Object.fromEntries(entries)))
      .catch(() => {});
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getLogs({
        page,
        pageSize,
        search,
        levels,
        categories,
        categoryActions,
        codes,
        dateFrom,
        dateTo,
      });
      setLogs(result.data);
      setTotalCount(result.totalCount);
      setTotalPages(Math.ceil(result.totalCount / pageSize) || 1);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    pageSize,
    search,
    levels,
    categories,
    categoryActions,
    codes,
    dateFrom,
    dateTo,
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    logs,
    totalCount,
    levelCounts,
    totalPages,
    categoriesList,
    actionsList,
    loading,
    error,
    loadData,
  };
}
