import { useState, useEffect } from "react";
import { adminPositionService } from "../services/adminstrativePosition.service";

export const useAdminPositionForm = (initialData, onSuccess) => {
  const [formData, setFormData] = useState({
    position: "",
    startDate: "",
    endDate: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        position: initialData.position || initialData.jobGrade || "",
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
        notes: initialData.notes || "",
      });
    }
  }, [initialData]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // مسح الخطأ الخاص بالحقل عند البدء في الكتابة أو التغيير
    if (error[name]) {
      setError((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (t) => {
    const newErrors = {};

    // 1. التأكد من الحقول المطلوبة
    if (!formData.position) newErrors.position = true;
    if (!formData.startDate) newErrors.startDate = true;

    // 2. الفاليديشن الخاص بالتاريخ
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      if (end <= start) {
        // نضع رسالة خطأ واضحة لتاريخ النهاية
        newErrors.endDate = t("end_date_after_start") || "تاريخ النهاية يجب أن يكون بعد تاريخ البداية";
      }
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (t, isEdit = false) => {
    if (!validate(t)) return;
 
    setLoading(true);
    try {
      if (isEdit) {
        await adminPositionService.update(initialData.id, formData);
      } else {
        await adminPositionService.create(formData);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      // استخدام مفتاح الترجمة الموجود في ملفك أو نص افتراضي
      setError({ api: t("submitError") || "فشل في حفظ البيانات" });
    } finally {
      setLoading(false);
    }
  };

  return { formData, loading, error, handleChange, submit };
};