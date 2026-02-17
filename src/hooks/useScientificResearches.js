import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../utils/axiosInstance";

export default function useScientificResearches(pageSize = 4) {
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
    const response = await axiosInstance.get(
      "/ResearchesAndTheses/Researches",
      {
        params: { pageIndex: page, pageSize },
      }
    );

    const result = response.data;

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
  }, [currentPage]);

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
