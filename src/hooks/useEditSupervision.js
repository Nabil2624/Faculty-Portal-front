import { useState } from "react";
import { updateThesisSupervision } from "../services/supervisionThesis.service";

export default function useEditSupervision(navigate, initialData = {}) {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* ---------------- VALIDATION ---------------- */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title?.trim()) newErrors.title = "thesisTitleRequired";

    if (!formData.studentName?.trim())
      newErrors.studentName = "studentNameRequired";

    if (!formData.gradeId) newErrors.gradeId = "degreeRequired";

    if (!formData.facultyMemberRole)
      newErrors.facultyMemberRole = "facultyRoleRequired";

    if (!formData.type) newErrors.type = "thesisTypeRequired";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */
  const submitEdit = async (thesesId) => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setServerError(null);

      await updateThesisSupervision(thesesId, formData);

      // NAVIGATE
      navigate("/supervision-thesis");
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    submitEdit,
    loading,
    errors,
    serverError,
    setFormData,
  };
}
