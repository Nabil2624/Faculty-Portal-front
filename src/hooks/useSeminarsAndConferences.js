import { useState, useEffect, useCallback } from "react";
import {
  getSeminarsAndConferences,
  deleteSeminarOrConference,
} from "../services/seminarsAndConferences.service";

export default function useSeminarsAndConferences(
  page = 1,
  pageSize = 9,
  search,
) {
  const [seminars, setSeminars] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

console.log(search);

  const loadData = useCallback(
    async (pageToLoad = page) => {
      setLoading(true);
      setError(null);

      try {
        const res = await getSeminarsAndConferences({
          pageIndex: pageToLoad,
          pageSize,
          search,
        });


        const data = res?.data?.data || [];
        const totalCount = res?.data?.totalCount || 0;

        setSeminars(
          data.map((item) => ({
            id: item.id,
            missionName: item.name || "",
            type: item.type || "",
            localOrInternational: item.localOrInternational || "",
            participationRole: item.roleOfParticipation?.valueEn || "",
            organizingAuthority: item.organizingAuthority || "",
            venue: item.venue || "",
            startDate: item.startDate || "",
            endDate: item.endDate || "",
            notes: item.notes || "",
            attachments: item.attachments || null,
          })),
        );

        setTotalPages(Math.max(1, Math.ceil(totalCount / pageSize)));
      } catch (err) {
        console.error("Failed to load seminars:", err);
        setError("fetchError");
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, search],
  );

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);

    try {
      await deleteSeminarOrConference(id);
      setSeminars((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete seminar:", err);
      setError("deleteError");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    seminars,
    totalPages,
    loading,
    error,
    loadData,
    handleDelete,
  };
}
