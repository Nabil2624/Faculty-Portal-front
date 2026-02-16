import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import ManifestationForm from "../components/widgets/ManifestationsOfScientificAppreciation/ManifestationForm";

import useManifestationForm from "../hooks/useManifestationForm";
import { createManifestation } from "../services/manifestationsOfScientificAppreciation";

export default function AddManifestation() {
  const { t, i18n } = useTranslation(
    "manifestation-of-scientific-appreciation-form",
  );

  const isArabic = i18n.language === "ar";
  const dir = i18n.dir();
  const navigate = useNavigate();

  const { form, setForm, errors, validate, setServerErrors } =
    useManifestationForm(t);

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      await createManifestation(form);

      navigate("/manifestations-of-scientific-appreciation");
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
        <ManifestationForm
          title={t("titles.addManifestation")}
          t={t}
          isArabic={isArabic}
          titleOfAppreciation={form.titleOfAppreciation}
          setTitleOfAppreciation={(v) =>
            setForm({ ...form, titleOfAppreciation: v })
          }
          issuingAuthority={form.issuingAuthority}
          setIssuingAuthority={(v) => setForm({ ...form, issuingAuthority: v })}
          dateOfAppreciation={form.dateOfAppreciation}
          setDateOfAppreciation={(v) =>
            setForm({ ...form, dateOfAppreciation: v })
          }
          description={form.description}
          setDescription={(v) => setForm({ ...form, description: v })}
          error={errors}
          onSave={handleSave}
          onCancel={() =>
            navigate("/manifestations-of-scientific-appreciation")
          }
        />
      </div>
    </ResponsiveLayoutProvider>
  );
}
