import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import UniversityContributionForm from "../components/widgets/University Contribution/UniversityContributionForm";
import useAddUniversityContributionForm from "../hooks/useAddUniversityContributionForm";
import useContributionTypeLookups from "../hooks/useContributionTypeLookups";

export default function AddUniversityContribution() {
  // 1. الترجمة واللغة بنجيبهم جوه الصفحة
  const { t, i18n } = useTranslation("university-contribution-form");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  // 2. بننادي اللوك-أب (الأنواع) هنا بدل ما نستناها بروبس
  const { types, loadingTypes } = useContributionTypeLookups();

  // 3. بنستخدم هوك الإضافة (تأكد إنك بتستخدم useAddUniversityContributionForm)
  const { formData, errors, loading, handleChange, submitForm } = 
    useAddUniversityContributionForm({
      onSuccess: () => navigate(-1),
    });

  return (
    <UniversityContributionForm
      t={t}
      isArabic={isArabic}
      types={types}
      loadingTypes={loadingTypes}
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