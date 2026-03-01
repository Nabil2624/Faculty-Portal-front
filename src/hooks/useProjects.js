import { useState, useEffect } from "react";
import { getProjects } from "../services/projects.service";

export default function useProjects(
  page,
  pageSize = 9,
  search,
  sortValue,
  localOrInternational,
  participationRoleIds,
  typeOfProjectIds,
) {
  const [projects, setProjects] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async (requestedPage = page) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getProjects({
        pageIndex: requestedPage,
        pageSize: pageSize,
        search: search,
        sort: sortValue,
        LocalOrInternationals: localOrInternational,
        TypeOfProjectIds: typeOfProjectIds,
        ParticipationRoleIds: participationRoleIds,
      });

      const { data, totalCount } = res.data || {};

      setProjects(data || []);

      const pages = Math.max(1, Math.ceil((totalCount || 0) / pageSize));

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
    loadData(page);
  }, [
    page,
    search,
    sortValue,
    localOrInternational,
    participationRoleIds,
    typeOfProjectIds,
  ]);

  return {
    projects,
    totalPages,
    loading,
    error,
    loadData,
  };
}
