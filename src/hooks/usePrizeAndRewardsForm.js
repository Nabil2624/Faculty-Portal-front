import { useState, useEffect } from "react";
import {
  createPrizeOrReward,
  uploadPrizeAttachments,
} from "../services/prizesAndRewards.service";

export default function usePrizesAndRewardsForm(t, initialData = null) {
  const [form, setForm] = useState({
    prizeId: "",
    awardingAuthority: "",
    dateReceived: "",
    description: null,
  });

  const [attachments, setAttachments] = useState([]); // <-- attachments state
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        prizeId: initialData.prize?.id || "",
        awardingAuthority: initialData.awardingAuthority || "",
        dateReceived: initialData.dateReceived?.split("T")[0] || "",
        description: initialData.description || null,
      });
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

  const handleSave = async (navigate) => {
    if (!validate()) return;
    setLoading(true);

    try {
      const savedPrize = await createPrizeOrReward(form);
      const entityId =
        savedPrize?.id || savedPrize?.data?.id || savedPrize?.data;
      if (!entityId) throw new Error("Prize ID not returned");

      // upload attachments if any
      if (attachments.length > 0) {
        await uploadPrizeAttachments(entityId, attachments);
      }

      if (navigate) navigate("/prizes-and-rewards");
    } catch (error) {
      setServerErrors({ message: t("messages.failedSave") });
    } finally {
      setLoading(false);
    }
  };
  return {
    form,
    setForm,
    errors,
    validate,
    setServerErrors,
    attachments,
    setAttachments,
    handleSave,
    loading,
  };
}
