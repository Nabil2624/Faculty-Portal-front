import { useState } from "react";
import { createManifestation, uploadManifestationAttachments } from "../services/manifestationsOfScientificAppreciation";

export default function useManifestationForm(t, navigate, initialData = null) {
  const [form, setForm] = useState({
    titleOfAppreciation: "",
    issuingAuthority: "",
    dateOfAppreciation: "",
    description: null,
  });

  const [attachments, setAttachments] = useState([]); // << هنا
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.titleOfAppreciation?.trim()) newErrors.titleOfAppreciation = t("messages.titleRequired");
    if (!form.issuingAuthority?.trim()) newErrors.issuingAuthority = t("messages.issuingAuthorityRequired");
    if (!form.dateOfAppreciation) newErrors.dateOfAppreciation = t("messages.dateRequired");
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
    setErrors(prev => ({ ...prev, ...newErrors }));
  };

  const handleSave = async () => { 
    if (!validate()) return;
    setLoading(true);

    try {
      const savedManifestation = await createManifestation(form);

      const entityId = savedManifestation?.id || savedManifestation?.data?.id || savedManifestation?.data;
      if (!entityId) throw new Error("Manifestation ID not returned");

      if (attachments.length > 0) {
        await uploadManifestationAttachments(entityId, attachments);
      }

      if (navigate) navigate("/manifestations-of-scientific-appreciation");
    } catch (error) {
      console.error(error);
      setErrors(prev => ({ ...prev, server: t("messages.failedSave") }));
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    setForm,
    attachments,
    setAttachments,
    errors,
    validate,
    setServerErrors,
    handleSave,
    loading,
  };
}