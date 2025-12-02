import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, Pen } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

export default function EditArticleForm({ data, onCancel, onSuccess }) {
  const { t, i18n } = useTranslation("AddArticleForm");
  const dir = i18n.dir();
  const isArabic = i18n.language === "ar";

  const [formData, setFormData] = useState({
    titleOfArticle: "",
    authority: "",
    reviewingDate: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (data) {
      setFormData({
        titleOfArticle: data.titleOfArticle || "",
        authority: data.authority || "",
        reviewingDate: data.reviewingDate || "",
        description: data.description || "",
      });
    }
  }, [data]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.put(
        `/ProjectsAndCommittees/UpdateReviewingArticle/${data.id}`,
        {
          titleOfArticle: formData.titleOfArticle,
          authority: formData.authority,
          reviewingDate: formData.reviewingDate,
          description: formData.description,
        },
        { skipGlobalErrorHandler: true }
      );

      // Call onSuccess callback if provided
      if (onSuccess) onSuccess(response.data);
    } catch (err) {
      console.error("Failed to update article:", err);

      // Local error handling
      if (err.response?.data?.errors) {
        // Example: array of validation errors
        const messages = err.response.data.errors
          .map((e) => e.errors.join(" | "))
          .join(", ");
        setError(messages);
      } else {
        setError(t("updateError") || "Failed to update article");
      }
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
      className="max-w-md mx-auto mt-6 bg-[#EDEDED] border-[#b38e19] border-2 rounded-xl shadow-sm p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-center mb-6">
        <Pen className="text-[#B38E19] mx-1" size={20} />
        <h2 className="text-xl font-semibold text-gray-800">
          {t("edit_article")}
        </h2>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}

      {/* Article Name */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t("article_name")} <span className="text-[#b38e19]"> * </span>
        </label>
        <input
          type="text"
          name="titleOfArticle"
          value={formData.titleOfArticle}
          onChange={handleChange}
          className={`${inputClass} ${focusClasses}`}
          placeholder={t("enter_article_name")}
        />
      </div>

      {/* Entity */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t("entity")} <span className="text-[#b38e19]"> * </span>
        </label>
        <input
          type="text"
          name="authority"
          value={formData.authority}
          onChange={handleChange}
          className={`${inputClass} ${focusClasses}`}
          placeholder={t("enter_entity")}
        />
      </div>

      {/* Review Date */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t("review_date")} <span className="text-[#b38e19]"> * </span>
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
        ></textarea>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className={`bg-[#b38e19] text-white w-24 h-10 rounded-md cursor-pointer font-${
            isArabic ? "cairo" : "roboto"
          } text-sm ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {loading ? t("saving") : t("save")}
        </button>

        <button
          type="button"
          onClick={() => onCancel && onCancel()}
          className={`bg-gray-300 text-black w-24 h-10 rounded-md cursor-pointer font-${
            isArabic ? "cairo" : "roboto"
          } text-sm`}
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}
