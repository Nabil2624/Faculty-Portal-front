import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  createCommunityServiceContribution,
  updateCommunityServiceContribution,
} from "../services/communityServiceContribution.service";

export default function useCommunityServiceContributionForm({
  mode = "add",
  selectedItem,
  onSuccess,
}) {
  const { t } = useTranslation("university-contribution-form");
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState({
    contributionName: "",
    contributionDate: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // لو في تعديل، نحط البيانات القديمة
  useEffect(() => {
    if (isEdit && selectedItem) {
      setFormData({
        contributionName: selectedItem.contributionTitle || "",
        contributionDate: selectedItem.dateOfContribution || "",
        description: selectedItem.description || "",
      });
    }
  }, [isEdit, selectedItem]);

  // تحديث قيمة الفورم
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // لما المستخدم يكتب، نمسح ال error للفيلد
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  // التحقق من صحة البيانات محلياً
  const validate = () => {
    const newErrors = {};
    if (!formData.contributionName?.trim())
      newErrors.contributionName = t("contribution_name_required");
    if (!formData.contributionDate)
      newErrors.contributionDate = t("contribution_date_required");
    return newErrors;
  };

  // تجهيز البيانات للإرسال
  const preparePayload = () => ({
    contributionTitle: formData.contributionName?.trim(),
    dateOfContribution: formData.contributionDate || null,
    description:
      formData.description?.trim() === "" ? null : formData.description?.trim(),
  });

  // إرسال الفورم
  const submitForm = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      const payload = preparePayload();

      if (isEdit) {
        await updateCommunityServiceContribution(selectedItem.id, payload);
      } else {
        await createCommunityServiceContribution(payload);
      }

      onSuccess?.();
    } catch (err) {
      // هنا متعرضش اي رسالة raw لل user
      console.error(err); // بس نسجل الخطأ console
      setErrors({
        submit: t("general_error"), // رسالة عامة للمستخدم
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    loading,
    handleChange,
    submitForm,
    setFormData,
  };
}
