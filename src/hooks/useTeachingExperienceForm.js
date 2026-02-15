import { useState, useEffect } from "react";

export default function useTeachingExperienceForm(t, initialData = null) {
  const [form, setForm] = useState({
    courseName: "",
    academicLevel: "",
    universityOrFaculty: "",
    startDate: "",
    endDate: null,        // 👈 مش required
    description: null,    // 👈 مش required
  });

  const [errors, setErrors] = useState({});

  // preload لو edit
  useEffect(() => {
    if (initialData) {
      setForm({
        courseName: initialData.courseName || "",
        academicLevel: initialData.academicLevel || "",
        universityOrFaculty: initialData.universityOrFaculty || "",
        startDate: initialData.startDate?.split("T")[0] || "",
        endDate: initialData.endDate?.split("T")[0] || null,  // 👈 مش required
        description: initialData.description || null,          // 👈 مش required
      });
    }
  }, [initialData]);

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!form.courseName?.trim()) {
      newErrors.courseName = t("messages.courseRequired");
    }

    if (!form.academicLevel?.trim()) {
      newErrors.academicLevel = t("messages.academicLevelRequired");
    }

    if (!form.universityOrFaculty?.trim()) {
      newErrors.universityOrFaculty = t("messages.universityRequired");
    }

    if (!form.startDate) {
      newErrors.startDate = t("messages.startDateRequired");
    }

    if (form.endDate && form.startDate && new Date(form.endDate) < new Date(form.startDate)) {
      newErrors.endDate = t("messages.endDateBeforeStartDate");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Errors من السيرفر
  const setServerErrors = (serverError) => {
    if (!serverError) return;

    const newErrors = {};

    if (serverError.message) {
      newErrors.server = serverError.message;
    }

    if (serverError.fields) {
      Object.keys(serverError.fields).forEach((key) => {
        newErrors[key] = serverError.fields[key];
      });
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
  };

  return {
    form,
    setForm,
    errors,
    validate,
    setServerErrors,
  };
}
