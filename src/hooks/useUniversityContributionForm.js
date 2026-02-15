import { useState } from "react";

export default function useUniversityContributionForm({ initialData = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    contributionName: initialData.contributionName || "",
    contributionTypeId: initialData.contributionTypeId || "",
    contributionDate: initialData.contributionDate || "",
    description: initialData.description || "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.contributionName.trim()) newErrors.contributionName = "مطلوب";
    if (!formData.contributionTypeId) newErrors.contributionTypeId = "مطلوب";
    if (!formData.contributionDate) newErrors.contributionDate = "مطلوب";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      setErrors({ submit: err.message || "حدث خطأ" });
    } finally {
      setLoading(false);
    }
  };

  return { formData, errors, loading, handleChange, submitForm, setFormData };
}
