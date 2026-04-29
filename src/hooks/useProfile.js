import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { getProfile } from "../services/profile.service";

export default function useProfile() {
  const { t } = useTranslation("dashboard");

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [personalDataNotFound, setPersonalDataNotFound] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPersonalDataNotFound(false);

    try {
      const response = await getProfile();
      setData(response.data);
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.ErrorMessage;
      if (status === 404 && message === "Personal data not found.") {
        setPersonalDataNotFound(true);
      }
      setError(t("errors.general"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { data, error, loading, personalDataNotFound, refetch: fetchProfile };
}
