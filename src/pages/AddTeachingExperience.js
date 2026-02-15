import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import TeachingExperienceForm from "../components/widgets/TeachingExperiences/TeachingExperienceForm";

import useTeachingExperienceForm from "../hooks/useTeachingExperienceForm";
import { createTeachingExperience } from "../services/teachingExperiences.service";

export default function AddTeachingExperience() {
  const { t, i18n } = useTranslation("teaching-experience-form");
  const isArabic = i18n.language === "ar";
  const dir = i18n.dir();
  const navigate = useNavigate();

  const { form, setForm, errors, validate, setServerErrors } =
    useTeachingExperienceForm(t);

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      await createTeachingExperience(form);
      navigate("/teaching-experiences");
    } catch (error) {
      setServerErrors(error.response?.data || { message: t("messages.failedSave") });
    } finally {
      setLoading(false);
    }
  };
 if (loading) return <LoadingSpinner />
  return (
    <ResponsiveLayoutProvider>
      <div dir={dir}>

        <TeachingExperienceForm
          title={t("titles.addTeachingExperience")}
          t={t}
          isArabic={isArabic}

          courseName={form.courseName}
          setCourseName={(v) => setForm({ ...form, courseName: v })}

          academicLevel={form.academicLevel}
          setAcademicLevel={(v) => setForm({ ...form, academicLevel: v })}

          universityOrFaculty={form.universityOrFaculty}
          setUniversityOrFaculty={(v) => setForm({ ...form, universityOrFaculty: v })}

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
