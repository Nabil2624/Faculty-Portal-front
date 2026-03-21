import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useThesisForm } from "../hooks/useThesisForm";

import LoadingSpinner from "../components/LoadingSpinner";
import CustomErrorModal from "../components/widgets/AddThesis/CustomErrorModal";
import ThesisForm from "../components/widgets/Theses/ThesisForm";

export default function EditThesis() {
  const { t, i18n } = useTranslation("EditThesis");
  const isArabic = i18n.language === "ar";
  const location = useLocation();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const thesisData = location.state?.thesis;
  
  const [attachments, setAttachments] = useState([]);
  const [initialAttachments, setInitialAttachments] = useState([]);

  // 1. تجهيز المرفقات عند تحميل الصفحة
  useEffect(() => {
    if (!thesisData) return;

    const prefillAttachments = (thesisData.attachments || []).map((att) => ({
      id: att.id,
      fileName: att.fileName,
      contentType: att.contentType,
      size: att.size,
      name: att.fileName,
    }));

    setAttachments(prefillAttachments);
    setInitialAttachments(prefillAttachments);
  }, [thesisData]);

  // 2. استخدام الـ Hook لإدارة العمليات المنطقية
  const { refs, values, setters, helpers, errors, loading } = useThesisForm({
    mode: "edit",
    thesisData,
    thesisId: thesisData?.id,
    t,
    setModalMessage,
    setIsModalOpen,
    isArabic,
  });

  if (loading) return <LoadingSpinner />;

  return (
    <>
      
      <ThesisForm
        formTitle={t("editThesis")} 
        values={values}
        setters={setters}
        helpers={helpers}
        errors={errors}
        loading={loading}
        attachments={attachments}
        setAttachments={setAttachments}
        onCancel={() => navigate("/theses")}
      />

      {/* مودال الأخطاء */}
      <CustomErrorModal
        message={modalMessage}
        onOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalMessage("");
        }}
        isArabic={isArabic}
      />
    </>
  );
}