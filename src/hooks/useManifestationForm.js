import { useState, useEffect } from "react";

export default function useManifestationForm(t, initialData = null) {
  const [form, setForm] = useState({
    titleOfAppreciation: "",
    issuingAuthority: "",
    dateOfAppreciation: "",
    description: null,
  });

  const [errors, setErrors] = useState({});

  // preload in case of edit
  useEffect(() => {
    if (initialData) {
      setForm({
        titleOfAppreciation: initialData.titleOfAppreciation || "",
        issuingAuthority: initialData.issuingAuthority || "",
        dateOfAppreciation: initialData.dateOfAppreciation?.split("T")[0] || "",
        description: initialData.description || null,
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};

    if (!form.titleOfAppreciation?.trim()) {
      newErrors.titleOfAppreciation = t("messages.titleRequired");
    }

    if (!form.issuingAuthority?.trim()) {
      newErrors.issuingAuthority = t("messages.issuingAuthorityRequired");
    }

    if (!form.dateOfAppreciation) {
      newErrors.dateOfAppreciation = t("messages.dateRequired");
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
