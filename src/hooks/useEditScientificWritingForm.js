// /hooks/useEditScientificWritingForm.js
import { useState, useEffect } from "react";

export default function useEditScientificWritingForm(existingData = {}, t, isArabic = false) {
  const [form, setForm] = useState({
    title: "",
    role: null,
    isbn: "",
    publishingHouse: "",
    publishingDate: "",
    description: "",
    serverError: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!existingData) return;

    setForm({
      title: existingData.title || "",
      role: existingData.authorRole?.id ?? null,
      isbn: existingData.isbn || "",
      publishingHouse: existingData.publishingHouse || "",
      publishingDate: existingData.publishingDate || "",
      description: existingData.description || "",
      serverError: "",
    });
  }, [existingData, isArabic]);

  const validate = () => {
    const newErrors = {};
    if (!form.title) newErrors.title = t("errors.BooktitleRequired");
    if (!form.role) newErrors.role = t("errors.roleRequired");
    if (!form.isbn) newErrors.isbn = t("errors.isbnRequired");
    if (!form.publishingHouse) newErrors.publishingHouse = t("errors.publishingHouseRequired");
    if (!form.publishingDate) newErrors.publishingDate = t("errors.publishingDateRequired");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { form, setForm, errors, validate };
}
