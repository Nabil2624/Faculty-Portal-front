import { useAdminPositionForm } from "../hooks/useAdminPositionForm";
import { useTranslation } from "react-i18next";
import AdminPositionForm from "../components/widgets/AdminPosition/AdminPositionForm";
import { useNavigate, useLocation } from "react-router-dom"; // استيراد useLocation

export function EditAdminPositionPage() {
  const { t, i18n } = useTranslation("form");
  const navigate = useNavigate();
  const location = useLocation();


  const initialData = location.state?.item || null;

  const handleSuccess = () => {
    navigate("/administrative-positions");
  };

  const { formData, loading, error, handleChange, submit } =
    useAdminPositionForm(initialData, handleSuccess);

  return (
    <AdminPositionForm
      t={t}
      isArabic={i18n.language === "ar"}
      formData={formData}
      onChange={handleChange}
      onSave={() => submit(t, true)}
      onCancel={() => navigate(-1)}
      loading={loading}
      error={error}
      formTitle={t("edit_admin_pos")}
    />
  );
}