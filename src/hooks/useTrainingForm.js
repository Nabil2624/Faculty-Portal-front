import { useState, useEffect } from "react";

export const useTrainingForm = (initialData, onSave, t) => {
  const [formData, setFormData] = useState({
    programType: 1,
    participationType: 1,
    programName: "",
    organizingAuthority: "",
    venue: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        id: initialData.id,
        programType: initialData.type === "InTheSpecialty" ? 1 : 2,
        participationType: initialData.participationType === "listener" ? 1 : 2,
        programName: initialData.trainingProgramName || "",
        organizingAuthority: initialData.organizingAuthority || "",
        venue: initialData.venue || "",
        description: initialData.description || "",
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.programName) newErrors.programName = t("errors.programNameRequired");
    if (!formData.organizingAuthority) newErrors.organizingAuthority = t("errors.organizingBodyRequired");
    if (!formData.venue) newErrors.venue = t("errors.locationRequired");
    if (!formData.startDate) newErrors.startDate = t("errors.startDateRequired");
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.endDate = t("errors.startBeforeEnd");
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  return { formData, setFormData, errors, handleSubmit };
};