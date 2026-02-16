import { useState, useEffect } from "react";

export default function usePrizesAndRewardsForm(t, initialData = null) {
  const [form, setForm] = useState({
    prizeId: "", // dropdown from lookups, mandatory
    awardingAuthority: "", // mandatory
    dateReceived: "", // mandatory
    description: null, // optional
    attachments: [], // optional
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        prizeId: initialData.prizeId || "",
        awardingAuthority: initialData.awardingAuthority || "",
        dateReceived: initialData.dateReceived?.split("T")[0] || "",
        description: initialData.description || null,
        attachments: initialData.attachments || [],
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};

    if (!form.prizeId) newErrors.prizeId = t("messages.prizeRequired");
    if (!form.awardingAuthority?.trim())
      newErrors.awardingAuthority = t("messages.awardingRequired");
    if (!form.dateReceived)
      newErrors.dateReceived = t("messages.dateReceivedRequired");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const setServerErrors = (serverError) => {
    if (!serverError) return;

    const newErrors = {};
    if (serverError.message) newErrors.server = serverError.message;
    if (serverError.fields) {
      Object.keys(serverError.fields).forEach((key) => {
        newErrors[key] = serverError.fields[key];
      });
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
  };

  return { form, setForm, errors, validate, setServerErrors };
}
