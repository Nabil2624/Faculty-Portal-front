import { useEffect, useState } from "react";
import { UniversityService } from "../services/dashboardAndReports.service";
import { useTranslation } from "react-i18next";

// 🔥 cache بره الهوك (shared بين كل components)
let cachedFaculties = null;
let isFetching = false;
let subscribers = [];

export const useFaculties = () => {
  const [faculties, setFaculties] = useState(cachedFaculties || []);
  const [loading, setLoading] = useState(!cachedFaculties);

  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const mapData = (data) => {
    return data.map((item) => ({
      id: item.id,
      name: isArabic ? item.nameAR : item.nameEN,
    }));
  };

  const fetchFaculties = async () => {
    // ✅ لو already عندنا data → خلاص
    if (cachedFaculties) return;

    // ✅ لو في request شغال → استنى
    if (isFetching) {
      return new Promise((resolve) => {
        subscribers.push(resolve);
      });
    }

    try {
      isFetching = true;
      setLoading(true);

      const res = await UniversityService.getFaculties();

      cachedFaculties = res.data;

      // 🔥 حدث كل الـ subscribers
      subscribers.forEach((cb) => cb(res.data));
      subscribers = [];
    } catch (error) {
      console.error("Error fetching faculties:", error);
    } finally {
      isFetching = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!cachedFaculties) {
      fetchFaculties();
    } else {
      // لو موجود cache → استخدمه مباشرة
      setFaculties(mapData(cachedFaculties));
      setLoading(false);
    }
  }, []);

  // 🔁 لو اللغة اتغيرت → اعمل remap بس (بدون API call)
  useEffect(() => {
    if (cachedFaculties) {
      setFaculties(mapData(cachedFaculties));
    }
  }, [i18n.language]);

  return {
    faculties,
    loading,
    refetch: fetchFaculties, // optional
  };
};