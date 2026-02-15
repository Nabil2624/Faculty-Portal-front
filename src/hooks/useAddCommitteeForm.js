// /hooks/useAddCommitteeForm.js
import { useState } from "react";

export default function useAddCommitteeForm(t) {
  const [form, setForm] = useState({
    committee: "",
    typeValue: "",
    degreeValue: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.committee) newErrors.committee = t("errors.committeeRequired");
    if (!form.typeValue) newErrors.typeValue = t("errors.typeRequired");
    if (!form.degreeValue) newErrors.degreeValue = t("errors.degreeRequired");
    if (!form.startDate) newErrors.startDate = t("errors.startDateRequired");

    if (form.startDate && form.endDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      if (start > end) {
        newErrors.endDate = t("errors.startBeforeEnd");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { form, setForm, errors, validate };
}
