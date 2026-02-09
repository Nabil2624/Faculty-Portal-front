import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  fetchNominatedResearches,
  approveNominatedResearch,
} from "../services/nominatedResearchService";

export default function useNominatedScientificResearch() {
  const { t, i18n } = useTranslation("NominatedResearch");
  const isArabic = i18n.language === "ar";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 4;

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetchNominatedResearches(currentPage, pageSize);
      const result = response.data;

      if (!result?.data?.length) {
        setError(t("empty"));
        setItems([]);
        setTotalPages(1);
      } else {
        setItems(
          result.data.map((item) => ({
            id: item.id,
            title: item.title,
            journal: item.journalOrConfernce,
            year: item.pubYear,
          })),
        );
        setTotalPages(Math.ceil(result.totalCount / pageSize));
      }
    } catch (err) {
      setError(err?.response?.data?.ErrorMessage || t("fetchError"));
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentPage]);

  // ✅ Approve research
  const handleApprove = async (item) => {
    try {
      await approveNominatedResearch(item.id);
      // Remove approved item from the list
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      alert("Failed to approve research"); // Or use a toast
      console.error(err);
    }
  };

  return {
    t,
    isArabic,
    items,
    loading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    handleApprove, // expose the approve function
  };
}
