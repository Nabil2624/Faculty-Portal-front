import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import GeneralExperienceForm from "../components/widgets/GeneralExperiences/GeneralExperienceForm";

import useGeneralExperienceForm from "../hooks/useGeneralExperienceForm";

import { createGeneralExperience } from "../services/generalExperience.service";

export default function AddGeneralExperience() {
  const { t, i18n } = useTranslation("add-general-experiences");
  const isArabic = i18n.language === "ar";
  const dir = i18n.dir();
  const navigate = useNavigate();

  const { form, setForm, errors, validate, setServerErrors } =
    useGeneralExperienceForm(t);

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      await createGeneralExperience(form);
      navigate("/general-experiences");
    } catch (error) {
      setServerErrors({ message: t("errors.failedAdd") });
    } finally {
      setLoading(false);
    }
  };
  {
    loading && <LoadingSpinner />;
  }
  return (
    <ResponsiveLayoutProvider>
      <div dir={dir}>
        <GeneralExperienceForm
          title={t("addGeneralExperience.title")}
          t={t}
          isArabic={isArabic}
          experience={form.experienceTitle}
          setExperience={(v) => setForm({ ...form, experienceTitle: v })}
          authority={form.authority}
          setAuthority={(v) => setForm({ ...form, authority: v })}
          countryCity={form.countryOrCity}
          setCountryCity={(v) => setForm({ ...form, countryOrCity: v })}
          startDate={form.startDate}
          setStartDate={(v) => setForm({ ...form, startDate: v })}
          endDate={form.endDate}
          setEndDate={(v) => setForm({ ...form, endDate: v })}
          description={form.description}
          setDescription={(v) => setForm({ ...form, description: v })}
          error={errors}
          onSave={handleSave}
          onCancel={() => navigate("/general-experiences")}
        />
      </div>
    </ResponsiveLayoutProvider>
  );
}
