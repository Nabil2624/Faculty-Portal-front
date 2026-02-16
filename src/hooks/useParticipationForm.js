import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  createParticipation,
  updateParticipation,
} from "../services/participationInQualityWork.service";

export default function useParticipationForm({
  mode = "add",
  selectedItem,
  onSuccess,
}) {
  const { t } = useTranslation("participation-quality-work-form");
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState({
    participationTitle: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && selectedItem) {
      setFormData({
        participationTitle: selectedItem.participationTitle || "",
        startDate: selectedItem.startDate || "",
        endDate: selectedItem.endDate || "",
        description: selectedItem.description || "",
      });
    }
  }, [isEdit, selectedItem]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.participationTitle?.trim())
      newErrors.participationTitle = t("errors.participationName_required");

    if (!formData.startDate)
      newErrors.startDate = t("errors.startDate_required");

    if (
      formData.endDate &&
      formData.startDate &&
      formData.endDate <= formData.startDate
    ) {
      newErrors.endDate = t("errors.endDate_invalid");
    }

    return newErrors;
  };

  const preparePayload = () => ({
    participationTitle: formData.participationTitle?.trim() || null,
    startDate: formData.startDate?.trim() || null,
    endDate: formData.endDate?.trim() || null,
    description: formData.description?.trim() || null,
  });

  const submitForm = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      const payload = preparePayload();

      if (isEdit) {
        await updateParticipation(selectedItem.id, payload);
      } else {
        await createParticipation(payload);
      }

      onSuccess?.();
    } catch (err) {
      console.error(err);
      setErrors({ submit: t("errors.submit_failed") });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    loading,
    handleChange,
    submitForm,
    setFormData,
  };
}
