import { useState, useEffect } from "react";
import {
  createPatent,
  uploadPatentAttachments,
} from "../services/patents.service";

export default function usePatentForm(t, initialData = null) {
  const [form, setForm] = useState({
    localOrInternational: "",
    nameOfPatent: "",
    accreditingAuthorityOrCountry: "",
    applyingDate: "",
    accreditationDate: null,
    description: null,
  });

  const [errors, setErrors] = useState({});
  const [attachments, setAttachments] = useState([]); // attachments state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        localOrInternational:
          initialData.localOrInternational === "Local"
            ? 1
            : initialData.localOrInternational === "International"
              ? 2
              : "",
        nameOfPatent: initialData.nameOfPatent || "",
        accreditingAuthorityOrCountry:
          initialData.accreditingAuthorityOrCountry || "",
        applyingDate: initialData.applyingDate || "",
        accreditationDate: initialData.accreditationDate || null,
        description: initialData.description || "",
      });

      // attachments prefill
      setAttachments(
        (initialData.attachments || []).map((a) => ({
          id: a.id,
          name: a.fileName,
          fileName: a.fileName,
          contentType: a.contentType,
          size: a.size,
          isExisting: true, // مهم جداً 
        })),
      );
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (form.localOrInternational === "")
      newErrors.localOrInternational = t("messages.typeRequired");
    if (!form.nameOfPatent?.trim())
      newErrors.nameOfPatent = t("messages.nameRequired");
    if (!form.accreditingAuthorityOrCountry?.trim())
      newErrors.accreditingAuthorityOrCountry = t("messages.authorityRequired");
    if (!form.applyingDate)
      newErrors.applyingDate = t("messages.applyingDateRequired");
    if (
      form.accreditationDate &&
      form.applyingDate &&
      new Date(form.accreditationDate) < new Date(form.applyingDate)
    )
      newErrors.accreditationDate = t("messages.accreditationBeforeApplying");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (navigate) => {
    if (!validate()) return;
    setLoading(true);

    try {
      const savedPatent = await createPatent(form);

      const entityId =
        savedPatent?.id || savedPatent?.data?.id || savedPatent?.data;
      if (!entityId) throw new Error("Patent ID not returned");

      // Upload attachments
      if (attachments.length > 0) {
        await uploadPatentAttachments(entityId, attachments);
      }

      if (navigate) navigate("/patents");
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({ ...prev, server: t("messages.failedSave") }));
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    setForm,
    errors,
    validate,
    attachments,
    setAttachments,
    handleSave,
    loading,
  };
}
