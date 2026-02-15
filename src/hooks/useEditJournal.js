import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  updateParticipationJournal,
} from "../services/participationJournals.service";

export default function useEditJournal({ id, onSuccess, onCancel }) {
  const { t } = useTranslation("journal-forms");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = (formData) => {
    const newErrors = {};

    if (!formData.nameOfMagazine?.trim())
      newErrors.nameOfMagazine = t("required_journal_name");

    if (!formData.typeOfParticipationId)
      newErrors.typeOfParticipationId =
        t("required_participation_type");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (formData) => {
    if (!validate(formData)) return;

    setLoading(true);
    setErrors({});

    try {
      await updateParticipationJournal(id, formData);
      onSuccess?.();
      onCancel?.();
    } catch {
      setErrors({ submit: t("submit_error") });
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, errors };
}
