import { useState, useEffect } from "react";
import { getProjects } from "../services/projects.service";

export default function useProjects(page, pageSize = 9) {
  const [projects, setProjects] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getProjects(page, pageSize);
      const { data, totalCount } = res.data || {};

      setProjects(data || []);

      const pages = Math.max(
        1,
        Math.ceil((totalCount || 0) / pageSize)
      );
      setTotalPages(pages);
    } catch (err) {
      console.error(err);
      setProjects([]);
      setTotalPages(1);
      setError("fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page]);

  return {
    projects,
    totalPages,
    loading,
    error,
    loadData,
  };
}
