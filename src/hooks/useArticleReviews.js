import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getArticleReviews } from "../services/articleReviews.service";

export default function useArticleReviews(page, pageSize, search, sortValue) {
  const { t } = useTranslation();

  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async (requestedPage = page) => {
    setLoading(true);
    setError(null);

    try {
      const resp = await getArticleReviews(
        requestedPage,
        pageSize,
        search,
        sortValue,
      );

      const data = resp?.data ?? [];
      const totalCount = resp?.totalCount ?? 0;

      setItems(Array.isArray(data) ? data : []);
      setTotalPages(Math.max(1, Math.ceil(totalCount / pageSize)));
    } catch (err) {
      console.error(err);
      setError(t("Failed-to-load-articles"));
    } finally {
      setLoading(false);
    }
  };

  // يرجع لأول صفحة لما السيرش يتغير
  useEffect(() => {
    if (page !== 1) return;
    loadData(1);
  }, [search]);

  // تحميل عادي لما الصفحة تتغير
  useEffect(() => {
    loadData(page);
  }, [page,sortValue]);

  return { items, totalPages, loading, error, loadData };
}
