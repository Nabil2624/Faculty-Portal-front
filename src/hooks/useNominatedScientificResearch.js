import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  fetchNominatedResearches,
  approveNominatedResearch,
  rejectNominatedResearch,
} from "../services/nominatedResearchService";

export default function useNominatedScientificResearch() {
  const { t, i18n } = useTranslation("NominatedResearch");
  const isArabic = i18n.language === "ar";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 4; // 4 cards per page

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetchNominatedResearches(currentPage, pageSize);

      const result = response.data;

      const mapped =
        result?.data?.map((item) => ({
          ...item,
        })) || [];

      setItems(mapped);

      const calculatedTotalPages = Math.max(
        1,
        Math.ceil((result?.totalCount || 0) / pageSize),
      );

      setTotalPages(calculatedTotalPages);

      if (mapped.length === 0) {
        setError(t("empty"));
      }
    } catch (err) {
      setItems([]);
      setError(err?.response?.data?.errorMessage || t("fetchError"));
    } finally {
      setLoading(false);
    }
  };

  //  reload when page changes
  useEffect(() => {
    loadData();
  }, [currentPage]);

  const handleApprove = async (item) => {
    try {
      await approveNominatedResearch(item.id);
      loadData(); // refresh current page after approve
    } catch (err) {
      alert("Failed to approve research");
    }
  };

  const handleReject = async (item) => {
    try {
      await rejectNominatedResearch(item.id);
      loadData(); // refresh page after reject
    } catch (err) {
      // alert("Failed to reject research");
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
    handleApprove,
    handleReject,
    reload: loadData,
  };
}
