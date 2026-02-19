// /hooks/useScientificWritingForm.js
import { useState } from "react";

export default function useScientificWritingForm(existingData = {}, t) {
  const [form, setForm] = useState({
    title: existingData.title || "",
    role: existingData.role || null,
    isbn: existingData.isbn || "",
    publishingHouse: existingData.publishingHouse || "",
    publishingDate: existingData.publishingDate || "",
    description: existingData.description || "",
    serverError: "",
  });
 
  


  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!form.title) newErrors.title = t("errors.BooktitleRequired");
    if (!form.role) newErrors.role = t("errors.roleRequired");
    if (!form.isbn) newErrors.isbn = t("errors.isbnRequired");
    if (!form.publishingHouse) newErrors.publishingHouse = t("errors.publishingHouseRequired");
    if (!form.publishingDate) newErrors.publishingDate = t("errors.publishingDateRequired");

    setErrors(newErrors);

    // true لو كل الحقول سليمة
    return Object.keys(newErrors).length === 0;
  };

  return { form, setForm, errors, validate };
}
