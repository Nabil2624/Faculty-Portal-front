import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"; // استيراد النافجيت
import { useJobGradeForm } from "../hooks/useJobGradeForm";
import JobGradeForm from "../components/widgets/JobGrade/JobGradeForm";
export function AddJobGradePage() {
  const { t, i18n } = useTranslation("form");
  const navigate = useNavigate();
  const { formData, degrees, loading, loadingDegrees, error, handleChange, submit } = 
    useJobGradeForm(null, () => navigate("/job-rankings"));

  return (
    <JobGradeForm
      t={t} isArabic={i18n.language === "ar"}
      formData={formData} degrees={degrees}
      onChange={handleChange} onSave={() => submit(t, false)}
      onCancel={() => navigate(-1)} loading={loading}
      loadingDegrees={loadingDegrees} error={error}
      formTitle={t("add_job_grade")}
    />
  );
}