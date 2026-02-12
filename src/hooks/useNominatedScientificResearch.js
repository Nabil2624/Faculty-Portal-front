import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  fetchNominatedResearches,
  approveNominatedResearch,
} from "../services/nominatedResearchService";

export default function useNominatedScientificResearch() {
  const { t, i18n } = useTranslation("NominatedResearch");
  const isArabic = i18n.language === "ar";

  const [allItems, setAllItems] = useState([]); // store all fetched data
  const [items, setItems] = useState([]); // store current page items
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 4;

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      // always fetch pageIndex 1 (backend requirement)
      const response = await fetchNominatedResearches(1, 1000); // large number to fetch all
      const result = response.data;

      if (!result?.data?.length) {
        setError(t("empty"));
        setAllItems([]);
        setItems([]);
        setTotalPages(1);
      } else {
        const mapped = result.data.map((item) => ({
          id: item.id,
          title: item.title,
          journal: item.journalOrConfernce,
          year: item.pubYear,
        }));

        setAllItems(mapped);
        setTotalPages(Math.ceil(mapped.length / pageSize));

        // slice current page
        const start = (currentPage - 1) * pageSize;
        setItems(mapped.slice(start, start + pageSize));
      }
    } catch (err) {
      setError(err?.response?.data?.ErrorMessage || t("fetchError"));
      setAllItems([]);
      setItems([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // update items when currentPage changes
  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    setItems(allItems.slice(start, start + pageSize));
  }, [currentPage, allItems]);

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (item) => {
    try {
      await approveNominatedResearch(item.id);
      // remove from allItems
      const newAll = allItems.filter((i) => i.id !== item.id);
      setAllItems(newAll);

      // adjust totalPages if needed
      setTotalPages(Math.ceil(newAll.length / pageSize));

      // adjust currentPage if last page becomes empty
      if ((currentPage - 1) * pageSize >= newAll.length) {
        setCurrentPage(Math.max(1, currentPage - 1));
      }
    } catch (err) {
      alert("Failed to approve research");
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
    handleApprove,
  };
}
