import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import PatentForm from "../components/widgets/Patents/PatentForm";

import usePatentForm from "../hooks/usePatentForm";
import { createPatent } from "../services/patents.service";

export default function AddPatent() {
  const { t, i18n } = useTranslation("patent-form");
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";
  const dir = i18n.dir();

  const { form, setForm, errors, validate, setServerErrors } = usePatentForm(t);

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      await createPatent(form);

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
          title={t("titles.addPatent")}
          form={form}
          setForm={setForm}
          errors={errors}
          onSave={handleSave}
          onCancel={() => navigate("/patents")}
          t={t}
          isArabic={isArabic}
        />
      </div>
    </ResponsiveLayoutProvider>
  );
}
