import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import UniversityContributionForm from "../components/widgets/University Contribution/UniversityContributionForm";
import useUniversityContributionForm from "../hooks/useUniversityContributionForm";
import useContributionTypeLookups from "../hooks/useContributionTypeLookups"; // ناديت اللوك اب هنا

export default function EditUniversityContribution() {
  const { t, i18n } = useTranslation("university-contribution-form");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const { state } = useLocation();

  // استلام الداتا اللي مبعوثة من الـ navigate
  const itemToEdit = state?.item;

  // جلب الأنواع (Lookups) جوه الصفحة بدل البروبس
  const { types, loadingTypes } = useContributionTypeLookups();

  const { formData, errors, loading, handleChange, submitForm } =
    useUniversityContributionForm({
      selectedItem: itemToEdit,
      onSuccess: () => navigate(-1), // يرجع للجدول بعد الحفظ
    });

  return (
    <UniversityContributionForm
      t={t}
      isArabic={isArabic}
      types={types} // مبعوثة من الـ hook اللي فوق
      loadingTypes={loadingTypes}
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