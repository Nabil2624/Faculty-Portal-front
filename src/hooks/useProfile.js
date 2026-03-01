import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { getProfile } from "../services/profile.service";

export default function useProfile() {
  const { t } = useTranslation("dashboard");

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getProfile();
      setData(response.data);
    } catch (err) {
      setError(t("errors.general"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { data, error, loading, refetch: fetchProfile };
}