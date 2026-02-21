// hooks/useParticipation.js
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getParticipation } from "../services/participationInQualityWork.service";

export default function useParticipationInQuallityWorks(
  page = 1,
  pageSize = 9,
  search,
) {
  const { t } = useTranslation("participation-quality-work-form");

  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getParticipation(page, pageSize, search);
      const { data, totalCount } = res.data;

      setItems(data || []);
      setTotalPages(Math.ceil(totalCount / pageSize) || 1);
    } catch (err) {
      console.error(err);

      setError(t("errors.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, search]);

  return { items, totalPages, loading, error, loadData };
}
