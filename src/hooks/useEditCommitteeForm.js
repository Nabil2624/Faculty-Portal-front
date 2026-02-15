// useEditCommitteeForm.js
import { useState, useEffect } from "react";

export default function useEditCommitteeForm(existingData, t) {
  const [form, setForm] = useState({
    committee: "",
    typeValue: "",
    degreeValue: "",
    startDate: "",
    endDate: "",
    description: "",
    serverError: "", // لتخزين أخطاء السيرفر
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!existingData) return;
    setForm({
      committee: existingData.nameOfCommitteeOrAssociation ?? "",
      typeValue: existingData.typeOfCommitteeOrAssociation?.id ?? "",
      degreeValue: existingData.degreeOfSubscription?.id ?? "",
      startDate: existingData.startDate ?? "",
      endDate: existingData.endDate ?? "",
      description: existingData.notes ?? "",
      serverError: "",
    });
  }, [existingData]);

  const validate = () => {
    const e = {};
    if (!form.committee) e.committee = t("errors.committeeRequired");
    if (!form.typeValue) e.typeValue = t("errors.typeRequired");
    if (!form.degreeValue) e.degreeValue = t("errors.degreeRequired");
    if (!form.startDate) e.startDate = t("errors.startDateRequired");
    if (form.startDate && form.endDate && new Date(form.startDate) > new Date(form.endDate)) {
      e.endDate = t("errors.startBeforeEnd");
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return { form, setForm, errors, validate };
}
