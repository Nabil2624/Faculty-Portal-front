import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getArticleReviews } from "../services/articleReviews.service";

export default function useArticleReviews(page, pageSize) {
  const { t } = useTranslation(); // hook الترجمة
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async (requestedPage = page) => {
    setLoading(true);
    setError(null);
    try {
      const { data, totalCount } = await getArticleReviews(requestedPage, pageSize);
      setItems(data || []);
      setTotalPages(Math.ceil(totalCount / pageSize));
    } catch (err) {
      setError(t("Failed-to-load-articles")); // استخدم الترجمة هنا
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(page);
  }, [page]);

  return { items, totalPages, loading, error, loadData, setItems, setTotalPages };
}
