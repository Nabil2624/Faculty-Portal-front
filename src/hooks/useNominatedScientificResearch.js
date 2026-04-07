import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  fetchNominatedResearches,
  approveNominatedResearch,
  rejectNominatedResearch,
} from "../services/nominatedResearchService";

export default function useNominatedScientificResearch(
  sortValue = 0,
  publisherType,
  PublicationType,
  source,
  derivedFrom,
) {
  const { t, i18n } = useTranslation("NominatedResearch");
  const isArabic = i18n.language === "ar";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 4;

  const loadData = async (pageNumber, isReset = false) => {
    setLoading(true);
    try {
      const response = await fetchNominatedResearches({
        currentPage: pageNumber, // نستخدم رقم الصفحة الممرر مباشرة للدالة
        pageSize,
        sort: sortValue,
        PublisherType: publisherType,
        PublicationType: PublicationType,
        Source: source,
        DerivedFrom: derivedFrom,
      });

      const result = response.data;
      const newMappedItems = result?.data || [];

      setItems((prev) => {
        if (pageNumber === 1 || isReset) {
          return newMappedItems;
        }
        // دمج مباشر بدون شروط معقدة للتأكد من العرض أولاً
        // إذا اشتغلت، سنضيف شرط منع التكرار لاحقاً
        return [...prev, ...newMappedItems];
      });

      const total = Math.max(1, Math.ceil((result?.totalCount || 0) / pageSize));
      setTotalPages(total);

    } catch (err) {
      console.error("Error loading researches:", err);
      setError(t("fetchError"));
    } finally {
      setLoading(false);
    }
  };

  // 1. عند تغيير الفلاتر: نصفر كل شيء ونطلب الصفحة 1
  useEffect(() => {
    setCurrentPage(1);
    loadData(1, true); 
  }, [sortValue, publisherType, PublicationType, source, derivedFrom]);

  // 2. عند تغيير الصفحة فقط (عن طريق View More):
  useEffect(() => {
    if (currentPage > 1) {
      loadData(currentPage, false);
    }
  }, [currentPage]);

  const handleApprove = async (item) => {
    try {
      await approveNominatedResearch(item.id || item.ID); // دعم الحالتين
      setItems((prev) => prev.filter((i) => (i.id || i.ID) !== (item.id || item.ID)));
    } catch (err) {
      alert("Failed to approve");
    }
  };

  const handleReject = async (item) => {
    try {
      await rejectNominatedResearch(item.id || item.ID);
      setItems((prev) => prev.filter((i) => (i.id || i.ID) !== (item.id || item.ID)));
    } catch (err) {}
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
    reload: () => {
      setCurrentPage(1);
      loadData(1, true);
    },
  };
}