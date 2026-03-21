import { useState, useEffect } from "react";

export const useMissionForm = (initialData, t) => {
  const [formData, setFormData] = useState({
    missionName: "",
    countryOrCity: "",
    universityOrFaculty: "",
    startDate: "",
    endDate: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  // ملء البيانات عند التعديل
  useEffect(() => {
    if (initialData) {
      setFormData({
        missionName: initialData.missionName || "",
        countryOrCity: initialData.countryOrCity || "",
        universityOrFaculty: initialData.universityOrFaculty || "",
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
        notes: initialData.notes || "",
      });
    }
  }, [initialData]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };


  const validate = () => {
    const newErrors = {};

    if (!formData.missionName?.trim()) {
      newErrors.missionName = t("errors.taskRequired") || "Task name is required";
    }
    
    if (!formData.countryOrCity?.trim()) {
      newErrors.countryOrCity = t("errors.countryCityRequired") || "Country/City is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = t("errors.startDateRequired") || "Start date is required";
    }

    // تحقق من منطقية التواريخ لو الاتنين موجودين
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.endDate = t("end_date_before_start") || "End date cannot be before start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { formData, handleChange, errors, validate, setErrors };
};