import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import TeachingExperienceForm from "../components/widgets/TeachingExperiences/TeachingExperienceForm";

import useTeachingExperienceForm from "../hooks/useTeachingExperienceForm";
import { updateTeachingExperience } from "../services/teachingExperiences.service";

export default function EditTeachingExperience() {
  const { t, i18n } = useTranslation("teaching-experience-form");
  const isArabic = i18n.language === "ar";
  const dir = i18n.dir();
  const navigate = useNavigate();
  const location = useLocation();

  const item = location.state?.item;

  // لو الصفحة اتفتحت من غير state
  useEffect(() => {
    if (!item) {
      navigate("/teaching-experiences", { replace: true });
    }
  }, [item, navigate]);

  const { form, setForm, errors, validate, setServerErrors } =
    useTeachingExperienceForm(t);

  const [loading, setLoading] = useState(false);

  // preload للـ edit
  useEffect(() => {
    if (item) {
      setForm({
        courseName: item.courseName || "",
        academicLevel: item.academicLevel || "",
        universityOrFaculty: item.universityOrFaculty || "",
        startDate: item.startDate || "",
        endDate: item.endDate || "",
        description: item.description || "",
      });
    }
  }, [item, setForm]);

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      // تحويل الحقول غير required إلى null قبل الإرسال
      const payload = {
        ...form,
        endDate: form.endDate || null,
        description: form.description?.trim() || null,
      };

      await updateTeachingExperience(item.id, payload);
      navigate("/teaching-experiences");
    } catch (error) {
      setServerErrors(
        error.response?.data || { message: t("messages.failedSave") }
      );
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;
  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div dir={dir}>
        <TeachingExperienceForm
          title={t("titles.editTeachingExperience")}
          t={t}
          isArabic={isArabic}

          courseName={form.courseName}
          setCourseName={(v) => setForm({ ...form, courseName: v })}

          academicLevel={form.academicLevel}
          setAcademicLevel={(v) => setForm({ ...form, academicLevel: v })}

          universityOrFaculty={form.universityOrFaculty}
          setUniversityOrFaculty={(v) =>
            setForm({ ...form, universityOrFaculty: v })
          }

          startDate={form.startDate}
          setStartDate={(v) => setForm({ ...form, startDate: v })}

          endDate={form.endDate}
          setEndDate={(v) => setForm({ ...form, endDate: v })}

          description={form.description}
          setDescription={(v) => setForm({ ...form, description: v })}

          error={errors}
          onSave={handleSave}
          onCancel={() => navigate("/teaching-experiences")}
        />
      </div>
    </ResponsiveLayoutProvider>
  );
}
