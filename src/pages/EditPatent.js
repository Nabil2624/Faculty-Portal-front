import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import PatentForm from "../components/widgets/Patents/PatentForm";

import usePatentForm from "../hooks/usePatentForm";
import {
  updatePatent,
  uploadPatentAttachments,
  deletePatentAttachment,
} from "../services/patents.service";

export default function EditPatent() {
  const { t, i18n } = useTranslation("patent-form");
  const navigate = useNavigate();
  const location = useLocation();

  const isArabic = i18n.language === "ar";
  const dir = i18n.dir();

  // this comes from navigate("/edit-patent", { state: { item } })
  const patent = location.state?.item;

  const {
    form,
    setForm,
    errors,
    validate,
    attachments,
    setAttachments,
    setServerErrors,
  } = usePatentForm(t, patent);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      // 🔁 رجع الرقم string
      const payload = {
        ...form,
        localOrInternational:
          form.localOrInternational === 1
            ? "Local"
            : form.localOrInternational === 2
              ? "International"
              : "",
      };

      await updatePatent(patent.id, payload);

      // =============================
      // DIFF LOGIC
      // =============================

      const existingIds = patent.attachments?.map((a) => a.id) || [];

      const currentExistingIds = attachments
        .filter((a) => a.isExisting)
        .map((a) => a.id);

      // Deleted files
      const deletedIds = existingIds.filter(
        (id) => !currentExistingIds.includes(id),
      );

      // New files
      const newFiles = attachments.filter((a) => !a.isExisting);

      // =============================
      //  DELETE
      // =============================
      for (const id of deletedIds) {
        await deletePatentAttachment(patent.id, id);
      }

      // =============================
      // UPLOAD
      // =============================
      if (newFiles.length > 0) {
        await uploadPatentAttachments(patent.id, newFiles);
      }

      navigate("/patents");
    } catch (error) {
      setServerErrors(
        error.response?.data || { message: t("messages.failedSave") },
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div dir={dir}>
        <PatentForm
          title={t("titles.editPatent")}
          form={form}
          setForm={setForm}
          errors={errors}
          attachments={attachments}
          setAttachments={setAttachments}
          onSave={handleSave}
          onCancel={() => navigate("/patents")}
          t={t}
          isArabic={isArabic}
        />
      </div>
    </ResponsiveLayoutProvider>
  );
}
