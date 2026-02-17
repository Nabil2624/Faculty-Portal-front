import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ScientificWritingForm from "../components/widgets/ScientificWriting/ScientificWritingForm";
import useAuthorRoles from "../hooks/useAuthorRoles";
import useScientificWritingForm from "../hooks/useScientificWritingForm";
import { createScientificWriting } from "../services/scientific-writing.service";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";

export default function AddScientificWriting() {
  const { t, i18n } = useTranslation("scientific-writing-form");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  // ✅ استخدمنا الهـook بدل useState لكل حقل
  const { form, setForm, errors, validate } = useScientificWritingForm({}, t);
  const { roles } = useAuthorRoles();

  const handleSave = async () => {
    if (!validate()) return;

    try {
      await createScientificWriting({
        title: form.title,
        AuthorRoleId: form.role,
        isbn: form.isbn,
        publishingHouse: form.publishingHouse,
        publishingDate: form.publishingDate,
        description: form.description,
      });

      navigate("/scientific-writing"); // redirect to list page
    } catch (err) {
      console.error(err);
      setForm((prev) => ({
        ...prev,
        serverError: t("errors.saveFailed"),
      }));
    }
  };

console.log("Selected role:", form.role);
  return (
    <ResponsiveLayoutProvider>
    <ScientificWritingForm
      formTitle={t("addScientificWriting.title")}
      t={t}
      isArabic={isArabic}
      title={form.title}
      setTitle={(v) => setForm((prev) => ({ ...prev, title: v }))}
      role={form.role}
      setRole={(v) => setForm((prev) => ({ ...prev, role: v }))}
      roles={roles}
      isbn={form.isbn}
      setIsbn={(v) => setForm((prev) => ({ ...prev, isbn: v }))}
      publishingHouse={form.publishingHouse}
      setPublishingHouse={(v) => setForm((prev) => ({ ...prev, publishingHouse: v }))}
      publishingDate={form.publishingDate}
      setPublishingDate={(v) => setForm((prev) => ({ ...prev, publishingDate: v }))}
      description={form.description}
      setDescription={(v) => setForm((prev) => ({ ...prev, description: v }))}
      error={errors}
      serverError={form.serverError}
      onSave={handleSave}
      onCancel={() => navigate(-1)}
    />
    </ResponsiveLayoutProvider>
  );
}
