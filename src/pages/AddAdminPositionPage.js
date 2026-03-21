import { useAdminPositionForm } from "../hooks/useAdminPositionForm";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"; // استيراد النافجيت
import AdminPositionForm from "../components/widgets/AdminPosition/AdminPositionForm";

export function AddAdminPositionPage() {
  const { t, i18n } = useTranslation("form");
  const navigate = useNavigate(); // تعريف التوجيه

  // عند نجاح العملية، نعود لصفحة القائمة
  const handleSuccess = () => {
    
    navigate("/administrative-positions"); 
  };

  const { formData, loading, error, handleChange, submit } = useAdminPositionForm(null, handleSuccess);

  return (
    <AdminPositionForm
      t={t}
      isArabic={i18n.language === "ar"}
      formData={formData}
      onChange={handleChange}
      onSave={() => submit(t, false)}
      onCancel={() => navigate(-1)} 
      loading={loading}
      error={error}
      formTitle={t("add_admin_pos")}
    />
  );
}