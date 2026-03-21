import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import ParticipationInQualityWorkForm from "../components/widgets/ParticipationinQualityWork/ParticipationInQualityWorkForm";
import useParticipationForm from "../hooks/useParticipationForm";

export default function EditParticipationInQualityWork() {
  const { t } = useTranslation("participation-quality-work-form");
  const navigate = useNavigate();
  const { state } = useLocation();

  const itemToEdit = state?.item;

  const { formData, errors, loading, handleChange, submitForm } =
    useParticipationForm({
      mode: "edit",
      selectedItem: itemToEdit,
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
      formTitle={t("edit_participation_title")}
    />
  );
}