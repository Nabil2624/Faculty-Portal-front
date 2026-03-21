import { useState, useEffect } from "react";
import { journalService } from "../services/participationJournals.service";
import { useTranslation } from "react-i18next";

export const useJournalForm = () => {
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  useEffect(() => {
    const fetchTypes = async () => {
      setLoadingTypes(true);
      try {
        const res = await journalService.getParticipationTypes();
        
        // تأكد من عمل Mapping للداتا عشان الـ Dropdown يفهمها
        // بنفترض إن السيرفر بيبعت valueAr و valueEn
        const formattedTypes = res.data?.map((type) => ({
          id: type.id,
          label: isArabic ? type.valueAr : type.valueEn,
        })) || [];

        setTypes(formattedTypes);
      } catch (err) {
        console.error("Failed to fetch types:", err);
      } finally {
        setLoadingTypes(false);
      }
    };
    fetchTypes();
  }, [isArabic]); // عشان يغير الـ Labels لو اللغة اتغيرت

  const addJournal = async (data) => {
    setLoading(true);
    try {
      return await journalService.add(data);
    } finally {
      setLoading(false);
    }
  };

  const updateJournal = async (id, data) => {
    setLoading(true);
    try {
      return await journalService.update(id, data);
    } finally {
      setLoading(false);
    }
  };

  return { addJournal, updateJournal, loading, types, loadingTypes };
};