import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CommunityServiceContributionsForm from "../components/widgets/CommunityServiceContributions/CommunityServiceContributionsForm";
import useCommunityServiceContributionForm from "../hooks/useCommunityServiceContributionForm";

export default function AddCommunityServiceContribution() {
  const { t } = useTranslation("university-contribution-form");
  const navigate = useNavigate();

  const { formData, errors, loading, handleChange, submitForm } =
    useCommunityServiceContributionForm({
      mode: "add",
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
      formTitle={t("add_contribution_title")}
    />
  );
}