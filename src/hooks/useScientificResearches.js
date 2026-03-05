import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getResearches } from "../services/scientificResearchService";

export default function useScientificResearches(
  pageSize = 4,
  search,
  sortValue = 0,
  publisherType,
  PublicationType,
  source,
  derivedFrom,
  page = 1, // استلام الصفحة كباراميتر من الصفحة الرئيسية
) {
  const { t, i18n } = useTranslation("ScientificResearches");

  const [researches, setResearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const fetchResearches = async (currentPage = 1) => {
    // شغل loading دائماً عند تغيير اللغة أو الصفحة الأولى
    setLoading(true);
    setError(null);

    try {
      const result = await getResearches({
        page: currentPage,
        pageSize,
        search,
        sort: sortValue,
        PublisherType: publisherType,
        PublicationType: PublicationType,
        Source: source,
        DerivedFrom: derivedFrom,
        // نمرر اللغة هنا إذا كان الـ Backend يتطلبها كـ Query Param
        lang: i18n.language 
      });

      if (!result?.data || result.data.length === 0) {
        setResearches([]);
        setTotalPages(1);
      } else {
        setResearches(result.data);
        setTotalPages(Math.ceil((result.totalCount || 0) / pageSize));
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || t("fetchError"));
      setResearches([]);
    } finally {
      setLoading(false);
    }
  };

  // المراقبة الأساسية: إعادة الجلب عند تغير أي من هذه القيم بما فيها اللغة
  useEffect(() => {
    fetchResearches(page);
  }, [
    page,
    search,
    sortValue,
    publisherType,
    PublicationType,
    source,
    derivedFrom,
    i18n.language, // <-- هذا هو السطر السحري الذي كان ينقصك
  ]);

  return {
    researches,
    loading,
    error,
    totalPages,
    fetchResearches,
  };
}