import { useState, useEffect, useCallback } from "react";
import {
  getSeminarsAndConferences,
  deleteSeminarOrConference,
} from "../services/seminarsAndConferences.service";
import { useTranslation } from "react-i18next";
export default function useSeminarsAndConferences(
  page = 1,
  pageSize = 9,
  search,
  sortValue,
  roleOfParticipationIds,
  localOrInternational,
  conferenceOrSeminar,
) {
  const [seminars, setSeminars] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";


  const loadData = useCallback(
    async (pageToLoad = page) => {
      setLoading(true);
      setError(null);

      try {
        const res = await getSeminarsAndConferences({
          pageIndex: pageToLoad,
          pageSize,
          search,
          sort: sortValue,
          RoleOfParticipationIds: roleOfParticipationIds,
          LocalOrInternational: localOrInternational,
          ConferenceOrSeminar: conferenceOrSeminar,
        });

        const data = res?.data?.data || [];
        const totalCount = res?.data?.totalCount || 0;

        setSeminars(
          data.map((item) => ({
            id: item.id,
            missionName: item.name || "",
            type: item.type || "",
            localOrInternational: item.localOrInternational || "",

            roleOfParticipation: item.roleOfParticipation || null,

            organizingAuthority: item.organizingAuthority || "",
            website: item.website || "",
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
    [
      page,
      pageSize,
      search,
      sortValue,
      roleOfParticipationIds,
      localOrInternational,
      conferenceOrSeminar,
    ],
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
