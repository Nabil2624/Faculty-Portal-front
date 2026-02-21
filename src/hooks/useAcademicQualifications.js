// hooks/useAcademicQualifications.js
import { useState, useEffect, useCallback } from "react";
import { getAcademicQualifications } from "../services/academicQualifications.service";

export default function useAcademicQualifications(
  page = 1,
  pageSize = 9,
  search = ""
) {
  const [qualifications, setQualifications] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(
    async (pageToLoad = page) => {
      setLoading(true);
      setError(null);
      try {
        const { data, totalCount } = await getAcademicQualifications({
          page: pageToLoad,
          pageSize,
          search, // استخدام آخر قيمة للبحث
        });

        setQualifications(data);
        setTotalPages(Math.ceil(totalCount / pageSize) || 1);
      } catch (err) {
        console.error("Failed to load qualifications:", err);
        setError("Failed to load qualifications");
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, search] // مهم جدًا: إضافة search كـ dependency
  );

  // تحميل البيانات عند تغيّر الصفحة أو البحث
  useEffect(() => {
    loadData();
  }, [loadData]);

  return { qualifications, totalPages, loading, error, loadData };
}