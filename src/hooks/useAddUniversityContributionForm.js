import { useState } from "react";
import { useTranslation } from "react-i18next";
import { createUniversityContribution } from "../services/universityContribution.service";

export default function useAddUniversityContributionForm({ onSuccess }) {
  const { t } = useTranslation("university-contribution-form");

  const initialFormData = {
    contributionName: "",
    contributionTypeId: "",
    contributionDate: "",
    description: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.contributionName?.trim())
      newErrors.contributionName = t("contribution_name_required");
    if (!formData.contributionTypeId)
      newErrors.contributionTypeId = t("contribution_type_required");
    if (!formData.contributionDate)
      newErrors.contributionDate = t("contribution_date_required");
    return newErrors;
  };

  const preparePayload = () => ({
    contributionTitle: formData.contributionName?.trim(),
    typeOfContributionId: formData.contributionTypeId || null,
    dateOfContribution: formData.contributionDate || null,
    description:
      formData.description?.trim() === "" ? null : formData.description?.trim(),
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

      await createUniversityContribution(payload);
      setFormData(initialFormData); // reset بعد الإضافة
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setErrors({ submit: t("general_error") });
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