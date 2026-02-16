import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import ManifestationForm from "../components/widgets/ManifestationsOfScientificAppreciation/ManifestationForm";

import useManifestationForm from "../hooks/useManifestationForm";
import { updateManifestation } from "../services/manifestationsOfScientificAppreciation";

export default function EditManifestation() {
  const { t, i18n } = useTranslation(
    "manifestation-of-scientific-appreciation-form",
  );
  const isArabic = i18n.language === "ar";
  const dir = i18n.dir();

  const navigate = useNavigate();
  const location = useLocation();

  const item = location.state?.item;

  // If page opened directly without state
  useEffect(() => {
    if (!item) {
      navigate("/manifestations-of-scientific-appreciation", { replace: true });
    }
  }, [item, navigate]);

  const { form, setForm, errors, validate, setServerErrors } =
    useManifestationForm(t);

  const [loading, setLoading] = useState(false);

  // preload data for edit
  useEffect(() => {
    if (item) {
      setForm({
        titleOfAppreciation: item.titleOfAppreciation || "",
        issuingAuthority: item.issuingAuthority || "",
        dateOfAppreciation: item.dateOfAppreciation || "",
        description: item.description || "",
      });
    }
  }, [item, setForm]);

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        ...form,
        description: form.description?.trim() || null,
      };

      await updateManifestation(item.id, payload);

      navigate("/manifestations-of-scientific-appreciation");
    } catch (error) {
      setServerErrors(
        error.response?.data || { message: t("messages.failedSave") },
      );
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;
  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div dir={dir}>
        <ManifestationForm
          title={t("titles.editManifestation")}
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
