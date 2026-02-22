import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../utils/axiosInstance";
import { getResearches } from "../services/scientificResearchService";

export default function useScientificResearches(pageSize = 4, search) {
  const { t } = useTranslation("ScientificResearches");

  const [researches, setResearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchResearches = async (page = 1) => {
    // شغل loading بس لو مفيش بيانات
    if (researches.length === 0) {
      setLoading(true);
    }

    setError(null);

    try {
      const result = await getResearches({ page, pageSize, search });
      console.log(result);
      if (!result?.data?.length) {
        setResearches([]);
        setTotalPages(1);
        setError(t("empty"));
      } else {
        setResearches(result.data);
        setTotalPages(Math.ceil(result.totalCount / pageSize));
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || t("fetchError"));
      setResearches([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearches(currentPage);
  }, [currentPage,search]);

  return {
    researches,
    loading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    fetchResearches,
  };
}
