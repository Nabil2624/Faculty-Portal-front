import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Plus } from "lucide-react";

export default function AddJournalForm({ onCancel }) {
  const { t, i18n } = useTranslation("journal-forms");
  const dir = i18n.dir();
  const isArabic = i18n.language === "ar";

  const [formData, setFormData] = useState({
    journalName: "",
    journalWebsite: "",
    participationType: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          {t("add_journal")}
        </h2>
      </div>

      {/* Journal Name */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t("journal_name")}<span className="text-[#b38e19]"> * </span>
        </label>
        <input
          type="text"
          name="journalName"
          value={formData.journalName}
          onChange={handleChange}
          placeholder={t("enter_journal_name")}
          className={`${inputClass} ${focusClasses}`}
        />
      </div>

      {/* Journal Website */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t("journal_website")}
        </label>
        <input
          type="text"
          name="journalWebsite"
          value={formData.journalWebsite}
          onChange={handleChange}
          placeholder={t("enter_journal_website")}
          className={`${inputClass} ${focusClasses}`}
        />
      </div>

      {/* Participation Type (Dropdown) */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t("participation_type")}<span className="text-[#b38e19]"> * </span>
        </label>

        <div className="relative">
          <select
            name="participationType"
            value={formData.participationType}
            onChange={handleChange}
            className={`${inputClass} ${focusClasses} appearance-none`}
          >
            <option value="">{t("select_participation_type")}</option>
            <option value="research">{t("research_participation")}</option>
            <option value="review">{t("review_participation")}</option>
            <option value="other">{t("other_participation")}</option>
          </select>

          <ChevronDown
            size={18}
            className="absolute top-2.5 text-[#B38E19] pointer-events-none"
            style={dir === "rtl" ? { left: "10px" } : { right: "10px" }}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-3 mt-8">
        <button
          type="submit"
          className={`bg-[#b38e19] text-white w-24 h-10 rounded-md cursor-pointer font-${
            isArabic ? "cairo" : "roboto"
          } text-sm`}
        >
          {t("add")}
        </button>

        <button
          type="button"
          onClick={onCancel}
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