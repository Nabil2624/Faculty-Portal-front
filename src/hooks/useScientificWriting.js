import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getScientificWriting } from "../services/scientific-writing.service";

export default function useScientificWriting(
  page = 1,
  pageSize = 9,
  search,
  sortValue = 0,
  filters,
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
      const res = await getScientificWriting(
        page,
        pageSize,
        search,
        sortValue,
        filters,
      );
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
  }, [page, search, sortValue, filters]);

  return { items, totalPages, loading, error, loadData };
}
