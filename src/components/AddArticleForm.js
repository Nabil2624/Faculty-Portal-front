import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, Plus } from "lucide-react";

export default function AddArticleForm({ onCancel }) {
  const { t, i18n } = useTranslation("AddArticleForm");
  const dir = i18n.dir();
  const isArabic = i18n.language === "ar";

  const [formData, setFormData] = useState({
    articleName: "",
    entity: "",
    reviewDate: "",
    description: "",
  });



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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
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
        <Plus className="text-[#B38E19] mx-1" size={23} />
        <h2 className="text-xl font-semibold text-gray-800">
          {t("add_article")}
        </h2>
      </div>

      {/* Article Name */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t("article_name")} <span className="text-[#B38E19]">*</span>
        </label>
        <input
          type="text"
          name="articleName"
          value={formData.articleName}
          onChange={handleChange}
          className={`${inputClass} ${focusClasses}`}
          placeholder={t("enter_article_name")}
        />
      </div>

      {/* Entity */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t("entity")} <span className="text-[#B38E19]">*</span>
        </label>
        <input
          type="text"
          name="entity"
          value={formData.entity}
          onChange={handleChange}
          className={`${inputClass} ${focusClasses}`}
          placeholder={t("enter_entity")}
        />
      </div>

      {/* Review Date */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t("review_date")} <span className="text-[#B38E19]">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            name="reviewDate"
            value={formData.reviewDate}
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
            value={formData.reviewDate}
            onChange={(e) =>
              setFormData((p) => ({ ...p, reviewDate: e.target.value }))
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
      <div className="flex justify-center gap-3 mt-8">
        <button
          type="submit"
          className={`bg-[#b38e19] text-white w-24 h-10 rounded-md cursor-pointer font-${
            isArabic ? "cairo" : "roboto"
          } text-sm`}
        >
          {t("add") || "Add"}
        </button>

        <button
          type="button"
          onClick={() => onCancel && onCancel()}
          className={`bg-gray-300 text-black w-24 h-10 rounded-md cursor-pointer font-${
            isArabic ? "cairo" : "roboto"
          } text-sm`}
        >
          {t("cancel") || "Cancel"}
        </button>
      </div>
    </form>
  );
}