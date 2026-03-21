// src/pages/EditAcademicQualification.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import AcademicForm from "../components/widgets/AcademicQualifications/AcademicForm";
import { useAcademicForm } from "../hooks/useAcademicForm";
import { academicService } from "../services/academicQualifications.service";
import LoadingSpinner from "../components/LoadingSpinner";

export default function EditAcademicQualification() {
  const { t, i18n } = useTranslation("add-academic-qualification");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const location = useLocation();
  
  // استلام البيانات القديمة من الـ State الخاص بالـ Router
  const existingData = location.state?.item || null;

  const [lookups, setLookups] = useState({ grades: [], dispatchTypes: [], degrees: [] });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // استخدام الـ Hook الموحد وتمرير البيانات الموجودة
  const { 
    formData, 
    setFormData, 
    attachments, 
    setAttachments, 
    errors, 
    validate 
  } = useAcademicForm(existingData, isArabic, t);

  useEffect(() => {
    const init = async () => {
      try {
        const [g, d, q] = await academicService.getLookups();
        setLookups({ grades: g.data, dispatchTypes: d.data, degrees: q.data });
      } catch (err) {
        console.error("Lookup error:", err);
      } finally {
        setFetching(false);
      }
    };
    init();
  }, []);

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      // 1. تحديث البيانات الأساسية
      const payload = {
        qualificationId: formData.degreeId,
        specialization: formData.specialization,
        gradeId: formData.gradeId,
        dispatchId: formData.delegationId,
        universityOrFaculty: formData.university,
        countryOrCity: formData.countryCity,
        dateOfObtainingTheQualification: formData.graduationDate,
      };

      await academicService.update(existingData.id, payload);

      // 2. معالجة المرفقات (المقارنة)
      const originalAttachments = existingData.attachments || [];

      // حذف المرفقات التي تم إزالتها من القائمة
      const deletedFiles = originalAttachments.filter(
        (oldFile) => !attachments.some((newFile) => newFile.id === oldFile.id)
      );
      for (const file of deletedFiles) {
        await academicService.deleteAttachment(existingData.id, file.id);
      }

      // رفع المرفقات الجديدة (التي لا تملك ID)
      const newFiles = attachments.filter((file) => !file.id);
      for (const file of newFiles) {
        await academicService.uploadAttachment(existingData.id, file);
      }

      navigate("/academic-qualifications");
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner />;

  return (
    <Layout>
      <AcademicForm
        formTitle={t("edit-academic-qualification")}
        t={t}
        isArabic={isArabic}
        lookups={lookups}
        formData={formData}
        setFormData={setFormData}
        attachments={attachments}
        setAttachments={setAttachments}
        errors={errors}
        onSave={handleSave}
        onCancel={() => navigate(-1)}
        loading={loading}
      />
    </Layout>
  );
}