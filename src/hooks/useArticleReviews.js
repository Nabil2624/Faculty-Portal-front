import { useState, useEffect } from "react";
import { getArticleReviews } from "../services/articleReviews.service";

export default function useArticleReviews(page, pageSize) {
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
      setError("Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(page);
  }, [page]);

  return { items, totalPages, loading, error, loadData, setItems, setTotalPages };
}
