// hooks/useSkills.js
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  getProfile,
  updateSkills as updateSkillsAPI,
} from "../services/profile.service";

export default function useSkills() {
  const { t } = useTranslation("dashboard");

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ================= Load skills from profile =================
  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProfile();
      const profileSkills = res?.data?.skills || [];
      setSkills(profileSkills.map((s, index) => ({ id: index, text: s })));
    } catch (err) {
      setError(t("errors.general"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  // ================= Update skills =================
  const saveSkills = async (modifiedSkills = []) => {
    setLoading(true);
    setError(null);

    // تأكيد إن modifiedSkills دايمًا array
    const skillsArray = Array.isArray(modifiedSkills) ? modifiedSkills : [];

    try {
      const payload = skillsArray.map((s) => s.text || "");
      await updateSkillsAPI({ skills: payload });

      // بعد التحديث، نخلي state
      setSkills(
        skillsArray.map((s, index) => ({ id: index, text: s.text || "" })),
      );
    } catch (err) {
      setError(t("errors.general"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { skills, loading, error, fetchSkills, saveSkills };
}
