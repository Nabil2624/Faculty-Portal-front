import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getJournalParticipationRoles } from "../services/participationJournals.service";

export default function useMagazineParticipationTypes() {
  const { t, i18n } = useTranslation("journal-forms");
  const isArabic = i18n.language === "ar";

  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTypes = async () => {
      setLoading(true);
      try {
        const data = await getJournalParticipationRoles();
        setTypes(
          data.map((item) => ({
            id: item.id,
            label: isArabic ? item.valueAr : item.valueEn,
          }))
        );
      } catch {
        setTypes([
          { id: "research", label: t("research_participation") },
          { id: "review", label: t("review_participation") },
          { id: "other", label: t("other_participation") },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTypes();
  }, [i18n.language, isArabic, t]);

  return { types, loading };
}
