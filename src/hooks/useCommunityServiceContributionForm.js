import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  createCommunityServiceContribution,
  updateCommunityServiceContribution,
} from "../services/communityServiceContribution.service";

export default function useCommunityServiceContributionForm({
  mode = "add",
  selectedItem,
  onSuccess,
}) {
  const { t } = useTranslation("university-contribution-form");
  const isEdit = mode === "edit";

  const initialFormData = {
    contributionName: "",
    contributionDate: "",
    description: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // كل مرة يتغير فيها mode أو selectedItem، نعمل reset للفورم
  useEffect(() => {
    if (isEdit && selectedItem) {
      setFormData({
        contributionName: selectedItem.contributionTitle || "",
        contributionDate: selectedItem.dateOfContribution || "",
        description: selectedItem.description || "",
      });
    } else {
      setFormData(initialFormData); // Add mode يبقى فاضي
    }
    setErrors({});
  }, [mode, selectedItem]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.contributionName?.trim())
      newErrors.contributionName = t("contribution_name_required");
    if (!formData.contributionDate)
      newErrors.contributionDate = t("contribution_date_required");
    return newErrors;
  };

  const preparePayload = () => ({
    contributionTitle: formData.contributionName?.trim(),
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

      if (isEdit) {
        await updateCommunityServiceContribution(selectedItem.id, payload);
      } else {
        await createCommunityServiceContribution(payload);
      }

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