import { useState, useEffect } from "react";

export default function usePatentForm(t, initialData = null) {
  const [form, setForm] = useState({
    localOrInternational: "", // required (number)
    nameOfPatent: "",
    accreditingAuthorityOrCountry: "",
    applyingDate: "",
    accreditationDate: null,
    description: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        localOrInternational: initialData.localOrInternational ?? "",
        nameOfPatent: initialData.nameOfPatent || "",
        accreditingAuthorityOrCountry:
          initialData.accreditingAuthorityOrCountry || "",
        applyingDate: initialData.applyingDate?.split("T")[0] || "",
        accreditationDate: initialData.accreditationDate?.split("T")[0] || null,
        description: initialData.description || null,
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};

    if (form.localOrInternational === "") {
      newErrors.localOrInternational = t("messages.typeRequired");
    }

    if (!form.nameOfPatent?.trim()) {
      newErrors.nameOfPatent = t("messages.nameRequired");
    }

    if (!form.accreditingAuthorityOrCountry?.trim()) {
      newErrors.accreditingAuthorityOrCountry = t("messages.authorityRequired");
    }

    if (!form.applyingDate) {
      newErrors.applyingDate = t("messages.applyingDateRequired");
    }

    if (
      form.accreditationDate &&
      form.applyingDate &&
      new Date(form.accreditationDate) < new Date(form.applyingDate)
    ) {
      newErrors.accreditationDate = t("messages.accreditationBeforeApplying");
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
