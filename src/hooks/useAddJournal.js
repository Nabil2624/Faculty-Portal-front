import { useState } from "react";
import { useTranslation } from "react-i18next";
import { createParticipationInMagazine } from "../services/participationJournals.service";

export default function useAddJournal({ onSuccess, onCancel }) {
  const { t } = useTranslation("journal-forms");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = (formData) => {
    const newErrors = {};

    if (!formData.nameOfMagazine?.trim())
      newErrors.nameOfMagazine = t("required_journal_name");

    if (!formData.typeOfParticipationId)
      newErrors.typeOfParticipationId = t("required_participation_type");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (formData) => {
    if (!validate(formData)) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await createParticipationInMagazine(formData);

      if (response.status === 200 && response.data?.id) {
        onSuccess?.(response.data);
        onCancel?.();
      } else {
        setErrors({ submit: t("submit_error") });
      }
    } catch {
      setErrors({ submit: t("submit_error") });
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, errors };
}
