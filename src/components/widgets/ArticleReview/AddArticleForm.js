import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, Plus } from "lucide-react";
import axiosInstance from "../../../utils/axiosInstance";

export default function AddArticleForm({ onCancel, onSuccess }) {
  const { t, i18n } = useTranslation("AddArticleForm");
  const dir = i18n.dir();
  const isArabic = i18n.language === "ar";

  // Form state with backend field names
  const [formData, setFormData] = useState({
    titleOfArticle: "",
    authority: "",
    reviewingDate: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const reviewDateRef = useRef(null);
  const [reviewFocused, setReviewFocused] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openDatePicker = (ref) => {
    if (!ref?.current) return;
    try {
      ref.current.showPicker();
    } catch {
      ref.current.focus();
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.titleOfArticle.trim())
      newErrors.titleOfArticle = t("required_article_name");
    if (!formData.authority.trim()) newErrors.authority = t("required_entity");
    if (!formData.reviewingDate.trim())
      newErrors.reviewingDate = t("required_review_date");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await axiosInstance.post(
        "/ProjectsAndCommittees/CreateReviewingArticle",
        formData,
        { skipGlobalErrorHandler: true }
      );

      // تحقق على نجاح الإضافة
      if (response.status === 200 && response.data?.id) {
        onSuccess && onSuccess(response.data);
        onCancel && onCancel();
      } else {
        setErrors({ submit: t("submit_error") });
      }
    } catch (err) {
      console.error(err);
      setErrors({ submit: t("submit_error") });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm text-gray-800 transition duration-150 bg-[#E2E2E2]";
  const focusClasses =
    "focus:outline-none focus:ring-2 focus:ring-[#B38E19] transition duration-150 shadow";

  return (
    <form
      key={i18n.language}
      dir={dir}
      onSubmit={handleSubmit}
      className="w-[420px] max-w-full bg-[#EDEDED] border-[#b38e19] border-2 rounded-xl shadow-sm p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-center mb-6">
        <Plus className="text-[#B38E19] mx-1" size={23} />
        <h2 className="text-xl font-semibold text-gray-800">{t("add_article")}</h2>
      </div>

      {/* Title of Article */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t("article_name")} <span className="text-[#B38E19]">*</span>
        </label>
        <input
          type="text"
          name="titleOfArticle"
          value={formData.titleOfArticle}
          onChange={handleChange}
          className={`${inputClass} ${focusClasses}`}
          placeholder={t("enter_article_name")}
        />
        {errors.titleOfArticle && (
          <p className="text-red-500 text-sm mt-1">{errors.titleOfArticle}</p>
        )}
      </div>

      {/* Authority */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t("entity")} <span className="text-[#B38E19]">*</span>
        </label>
        <input
          type="text"
          name="authority"
          value={formData.authority}
          onChange={handleChange}
          className={`${inputClass} ${focusClasses}`}
          placeholder={t("enter_entity")}
        />
        {errors.authority && (
          <p className="text-red-500 text-sm mt-1">{errors.authority}</p>
        )}
      </div>

      {/* Reviewing Date */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t("review_date")} <span className="text-[#B38E19]">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            name="reviewingDate"
            value={formData.reviewingDate}
            readOnly
            onClick={() => openDatePicker(reviewDateRef)}
            className={`${inputClass} ${focusClasses} ${
              reviewFocused ? "ring-2 ring-[#B38E19]" : ""
            } cursor-pointer`}
            placeholder={t("select_review_date")}
          />
          <input
            ref={reviewDateRef}
            type="date"
            value={formData.reviewingDate}
            onChange={(e) =>
              setFormData((p) => ({ ...p, reviewingDate: e.target.value }))
            }
            onFocus={() => setReviewFocused(true)}
            onBlur={() => setReviewFocused(false)}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
            style={{ colorScheme: "light" }}
            aria-hidden="true"
            tabIndex={-1}
          />
          <Calendar
            size={18}
            className="absolute top-2.5 text-[#B38E19] cursor-pointer z-20"
            style={dir === "rtl" ? { left: "10px" } : { right: "10px" }}
            onClick={() => openDatePicker(reviewDateRef)}
          />
        </div>
        {errors.reviewingDate && (
          <p className="text-red-500 text-sm mt-1">{errors.reviewingDate}</p>
        )}
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t("description")}
        </label>
        <textarea
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          placeholder={t("enter_description")}
          className={`${inputClass} ${focusClasses} bg-[#f5f5f5] resize-none text-gray-600`}
        />
      </div>

      {/* Submit Error */}
      {errors.submit && <p className="text-red-500 text-center mb-4">{errors.submit}</p>}

      {/* Buttons */}
      <div className="flex justify-center gap-3 mt-8">
        <button
          type="submit"
          disabled={loading}
          className={`bg-[#b38e19] text-white w-24 h-10 rounded-md cursor-pointer font-${
            isArabic ? "cairo" : "roboto"
          } text-sm`}
        >
          {loading ? t("loading") : t("add")}
        </button>
      
      </div>
    </form>
  );
}
