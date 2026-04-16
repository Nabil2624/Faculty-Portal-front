import { useEffect, useState, useCallback } from "react";
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

  // تغيير الـ States لتدعم الـ Cursor Pagination
  const [nextCursor, setNextCursor] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadData = async (cursorValue = 0, isReset = false) => {
    setLoading(true);
    try {
      const response = await fetchNominatedResearches({
        take: 9,
        cursor: cursorValue, // نبعت الكيرسور للباك إند (تأكد من اسم البارامتر المطلوب في الـ API عندك)
        sort: sortValue,
        PublisherType: publisherType,
        PublicationType: PublicationType,
        Source: source,
        DerivedFrom: derivedFrom,
      });

      const result = response.data;
      // بناءً على الـ JSON المرفق، الداتا راجعة جوة "items"
      const newMappedItems = result?.items || [];

      setItems((prev) => {
        if (cursorValue === 0 || isReset) {
          return newMappedItems;
        }
        return [...prev, ...newMappedItems];
      });

      // تحديث حالة الكيرسور وهل في داتا تانية ولا لأ
      setNextCursor(result?.nextCursor || 0);
      setHasMore(result?.hasMore || false);

    } catch (err) {
      console.error("Error loading researches:", err);
      setError(t("fetchError"));
    } finally {
      setLoading(false);
    }
  };

  // 1. عند تغيير الفلاتر: نصفر كل حاجة ونطلب من الـ Cursor 0
  useEffect(() => {
    setNextCursor(0);
    setHasMore(true);
    loadData(0, true);
  }, [sortValue, publisherType, PublicationType, source, derivedFrom]);

  // دالة مخصصة لزرار Show More
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadData(nextCursor, false);
    }
  }, [loading, hasMore, nextCursor]);

  // 2. الحل السحري للمشكلة: لو الليستة فضيت (عملنا Accept للكل) ولسه في داتا، هاتها أوتوماتيك
  useEffect(() => {
    // نتأكد إن مفيش عناصر، وإن لسه فيه داتا في السيرفر، ومش بيعمل تحميل حاليا، والكيرسور مش صفر
    if (items.length === 0 && hasMore && !loading && nextCursor !== 0) {
      loadMore();
    }
  }, [items.length, hasMore, loading, nextCursor, loadMore]);

  const handleApprove = async (item) => {
    try {
      const itemId = item.id || item.ID; // دعم الحالتين
      await approveNominatedResearch(itemId);
      setItems((prev) => prev.filter((i) => (i.id || i.ID) !== itemId));
    } catch (err) {
      alert("Failed to approve");
    }
  };

  const handleReject = async (item) => {
    try {
      const itemId = item.id || item.ID;
      await rejectNominatedResearch(itemId);
      setItems((prev) => prev.filter((i) => (i.id || i.ID) !== itemId));
    } catch (err) {}
  };

  return {
    t,
    isArabic,
    items,
    loading,
    error,
    hasMore, // هنستخدمها عشان نظهر أو نخفي زرار "Show More" في الـ UI
    loadMore, // هنربطها بـ onClick بتاع زرار "Show More"
    handleApprove,
    handleReject,
    reload: () => {
      setNextCursor(0);
      loadData(0, true);
    },
  };
}