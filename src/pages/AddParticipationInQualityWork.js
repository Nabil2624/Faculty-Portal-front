import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ParticipationInQualityWorkForm from "../components/widgets/ParticipationinQualityWork/ParticipationInQualityWorkForm";
import useParticipationForm from "../hooks/useParticipationForm";

export default function AddParticipationInQualityWork() {
  const { t } = useTranslation("participation-quality-work-form");
  const navigate = useNavigate();

  const { formData, errors, loading, handleChange, submitForm } =
    useParticipationForm({
      mode: "add",
      onSuccess: () => navigate(-1),
    });

  return (
    <ParticipationInQualityWorkForm
      formData={formData}
      errors={errors}
      handleChange={handleChange}
      submitForm={submitForm}
      onCancel={() => navigate(-1)}
      loading={loading}
      formTitle={t("add_participation_title")}
    />
  );
}