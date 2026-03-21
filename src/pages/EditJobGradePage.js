import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useJobGradeForm } from "../hooks/useJobGradeForm";
import JobGradeForm from "../components/widgets/JobGrade/JobGradeForm";
import { useLocation } from "react-router-dom";
export function EditJobGradePage() {
  const { t, i18n } = useTranslation("form");
  const navigate = useNavigate();
  const { state } = useLocation();
  const { formData, degrees, loading, loadingDegrees, error, handleChange, submit } = 
    useJobGradeForm(state?.item, () => navigate("/job-rankings"));

  return (
    <JobGradeForm
      t={t} isArabic={i18n.language === "ar"}
      formData={formData} degrees={degrees}
      onChange={handleChange} onSave={() => submit(t, true)}
      onCancel={() => navigate(-1)} loading={loading}
      loadingDegrees={loadingDegrees} error={error}
      formTitle={t("edit_job_grade")}
    />
  );
}