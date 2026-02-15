import { useState, useEffect } from "react";

/**
 * Custom hook لإدارة Edit General Experience Form
 */
export default function useEditGeneralExperienceForm(t, initialData) {
  const [form, setForm] = useState({
    experienceTitle: "",
    authority: "",
    countryOrCity: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  // 🔹 preload data
  useEffect(() => {
    if (initialData) {
      setForm({
        experienceTitle: initialData.experienceTitle || "",
        authority: initialData.authority || "",
        countryOrCity: initialData.countryOrCity || "",
        startDate: initialData.startDate?.split("T")[0] || "",
        endDate: initialData.endDate?.split("T")[0] || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};

    if (!form.experienceTitle?.trim()) {
      newErrors.experience = t("errors.experienceRequired");
    }

    if (!form.countryOrCity?.trim()) {
      newErrors.countryCity = t("errors.countryCityRequired");
    }

    if (!form.authority?.trim()) {
      newErrors.authority = t("errors.authorityRequired");
    }

    if (!form.startDate) {
      newErrors.startDate = t("errors.startDateRequired");
    }

    if (
      form.endDate &&
      form.startDate &&
      new Date(form.endDate) < new Date(form.startDate)
    ) {
      newErrors.endDate = t("errors.endDateInvalid");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const setServerErrors = (serverError) => {
    if (!serverError) return;

    const newErrors = {};

    if (serverError.message) {
      newErrors.server = serverError.message;
    }

    if (serverError.fields) {
      Object.keys(serverError.fields).forEach((key) => {
        newErrors[key] = serverError.fields[key];
      });
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
  };

  return {
    form,
    setForm,
    errors,
    validate,
    setServerErrors,
  };
}
