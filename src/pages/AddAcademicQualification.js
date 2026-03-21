import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import AcademicForm from "../components/widgets/AcademicQualifications/AcademicForm";
import { useAcademicForm } from "../hooks/useAcademicForm";
import { academicService } from "../services/academicQualifications.service";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AddAcademicQualification() {
  const { t, i18n } = useTranslation("add-academic-qualification");
  const navigate = useNavigate();
  const [lookups, setLookups] = useState({ grades: [], dispatchTypes: [], degrees: [] });
  const [loading, setLoading] = useState(false);
  const { formData, setFormData, attachments, setAttachments, errors, validate } = useAcademicForm(null, i18n.language === "ar", t);

  useEffect(() => {
    academicService.getLookups().then(([g, d, q]) => 
      setLookups({ grades: g.data, dispatchTypes: d.data, degrees: q.data }));
  }, []);

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await academicService.create({
        qualificationId: formData.degreeId,
        specialization: formData.specialization,
        gradeId: formData.gradeId,
        dispatchId: formData.delegationId,
        universityOrFaculty: formData.university,
        countryOrCity: formData.countryCity,
        dateOfObtainingTheQualification: formData.graduationDate,
      });
      
      const id = res.data?.id || res.id;
      if (attachments.length > 0) {
        for (const file of attachments) await academicService.uploadAttachment(id, file);
      }
      navigate("/academic-qualifications");
    } finally { setLoading(false); }
  };

  return (
    <Layout>
      <AcademicForm
        formTitle={t("addAcademicQualification")}
        t={t} isArabic={i18n.language === "ar"}
        lookups={lookups} formData={formData} setFormData={setFormData}
        attachments={attachments} setAttachments={setAttachments}
        errors={errors} onSave={handleSave} onCancel={() => navigate(-1)}
        loading={loading}
      />
    </Layout>
  );
}