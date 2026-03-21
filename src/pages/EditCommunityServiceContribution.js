import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import CommunityServiceContributionsForm from "../components/widgets/CommunityServiceContributions/CommunityServiceContributionsForm";
import useCommunityServiceContributionForm from "../hooks/useCommunityServiceContributionForm";

export default function EditCommunityServiceContribution() {
  const { t } = useTranslation("university-contribution-form");
  const navigate = useNavigate();
  const { state } = useLocation();

  // استلام العنصر المبعوث من الجدول
  const itemToEdit = state?.item;

  const { formData, errors, loading, handleChange, submitForm } =
    useCommunityServiceContributionForm({
      mode: "edit",
      selectedItem: itemToEdit,
      onSuccess: () => navigate(-1),
    });

  return (
    <CommunityServiceContributionsForm
      formData={formData}
      errors={errors}
      handleChange={handleChange}
      submitForm={submitForm}
      onCancel={() => navigate(-1)}
      loading={loading}
      formTitle={t("edit_contribution_title")}
    />
  );
}