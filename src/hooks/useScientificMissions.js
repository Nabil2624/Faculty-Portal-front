// hooks/useScientificMissions.js
import { useState, useEffect, useCallback } from "react";
import { getScientificMissions } from "../services/scientificMission.service";

export default function useScientificMissions(page = 1, pageSize = 9, search) {
  const [missions, setMissions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(
    async (pageToLoad = page) => {
      setLoading(true);
      setError(null);

      try {
        const res = await getScientificMissions({
          page: pageToLoad,
          pageSize,
          search,
        });

        console.log("Scientific Missions:", res);

        const { data = [], totalCount = 0 } = res || {};

        setMissions(data);
        setTotalPages(Math.ceil(totalCount / pageSize) || 1);
      } catch (err) {
        console.error(err);
        setError(err?.message || "Failed to load missions");
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, search]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { missions, totalPages, loading, error, loadData };
}