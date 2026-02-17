import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import ScientificWritingForm from "../components/widgets/ScientificWriting/ScientificWritingForm";
import useScientificWritingForm from "../hooks/useScientificWritingForm";
import useAuthorRoles from "../hooks/useAuthorRoles";
import { updateScientificWriting } from "../services/scientific-writing.service";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";

export default function EditScientificWriting() {
  const { t, i18n } = useTranslation("scientific-writing-form");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const { state } = useLocation();
  const existingData = state?.item;

  const { form, setForm, errors, validate } = useScientificWritingForm(
    existingData,
    t,
  );

  const { roles } = useAuthorRoles();

  useEffect(() => {
    if (existingData?.authorRole && roles.length > 0) {
      const matchedRole = roles.find(
        (r) => r.id === existingData.authorRole.id,
      );

      if (matchedRole) {
        setForm((prev) => ({
          ...prev,
          role: {
            id: matchedRole.id,
            label: isArabic ? matchedRole.valueAr : matchedRole.valueEn,
          },
        }));
      }
    }
  }, [existingData, roles, isArabic, setForm]);

  const handleSave = async () => {
    if (!validate()) return;

    try {
      await updateScientificWriting(existingData.id, {
        title: form.title,
        AuthorRoleId: form.role, // ⚡️ خلي id بس
        isbn: form.isbn,
        publishingHouse: form.publishingHouse,
        publishingDate: form.publishingDate,
        description: form.description || null,
      });

      // بعد الحفظ نروح للصفحة الرئيسية
      navigate("/scientific-writing");
    } catch (err) {
      // Console فقط في development
      if (process.env.NODE_ENV === "development") {
        console.error("Error updating scientific writing:", err);
      }

      // تخزين رسالة الخطأ داخليًا
      setForm((prev) => ({
        ...prev,
        serverError: t("errors.genericSaveError") || "حدث خطأ أثناء الحفظ",
      }));
    }
  };
  console.log(form.data);
  
  

  return (
    <ResponsiveLayoutProvider>
      <ScientificWritingForm
        formTitle={t("editScientificWriting.title")}
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
        setPublishingHouse={(v) =>
          setForm((prev) => ({ ...prev, publishingHouse: v }))
        }
        publishingDate={form.publishingDate}
        setPublishingDate={(v) =>
          setForm((prev) => ({ ...prev, publishingDate: v }))
        }
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
