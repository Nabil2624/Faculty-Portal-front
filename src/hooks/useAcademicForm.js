// src/hooks/useAcademicForm.js
import { useState, useEffect } from "react";
import { academicService } from "../services/academicQualifications.service";

export const useAcademicForm = (initialData, isArabic, t) => {
  const [formData, setFormData] = useState({
    degreeId: "",
    specialization: "",
    delegationId: "",
    gradeId: "",
    graduationDate: "",
    countryCity: "",
    university: "",
  });
  const [attachments, setAttachments] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        degreeId: initialData.qualification?.id || "",
        specialization: initialData.specialization || "",
        delegationId: initialData.dispatchType?.id || "",
        gradeId: initialData.grade?.id || "",
        graduationDate: initialData.dateOfObtainingTheQualification || "",
        countryCity: initialData.countryOrCity || "",
        university: initialData.universityOrFaculty || "",
      });
      setAttachments(initialData.attachments?.map(att => ({ ...att, name: att.fileName })) || []);
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.degreeId) newErrors.degreeId = t("requiredField");
    if (!formData.specialization) newErrors.specialization = t("requiredField");
    if (!formData.graduationDate) newErrors.graduationDate = t("requiredField");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { formData, setFormData, attachments, setAttachments, errors, validate };
};