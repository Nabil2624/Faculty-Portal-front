import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, Pen,ChevronDown } from "lucide-react";

export default function EditJournalForm({ data, onCancel }) {
  const { t, i18n } = useTranslation("journal-forms");
  const dir = i18n.dir();
  const isArabic = i18n.language === "ar";

  const [formData, setFormData] = useState({
    journalName: "",
    journalWebsite: "",
    participationType: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        journalName: data.journalName || "",
        journalWebsite: data.journalWebsite || "",
        participationType: data.participationType || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Journal:", formData);
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
          {t("edit_journal")} 
        </h2>
      </div>

      {/* Journal Name */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t("journal_name")} <span className="text-[#B38E19]">*</span>
        </label>
        <input
          type="text"
          name="journalName"
          value={formData.journalName}
          onChange={handleChange}
          className={`${inputClass} ${focusClasses}`}
          placeholder={t("enter_journal_name")}
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
          className={`${inputClass} ${focusClasses}`}
          placeholder={t("enter_journal_website")}
        />
      </div>

      {/* Participation Type (Dropdown) */}
    
       <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t("participation_type")} <span className="text-[#B38E19]">*</span>
        </label>

        <div className="relative">
          <select
            name="participationType"
            value={formData.participationType}
            onChange={handleChange}
            className={`${inputClass} ${focusClasses} appearance-none`}
          >
         <option value="">{t("select_participation_type")}</option>
          <option value="author">{t("author")}</option>
          <option value="reviewer">{t("reviewer")}</option>
          <option value="editor">{t("editor")}</option>
          </select>

          <ChevronDown
            size={18}
            className="absolute top-2.5 text-[#B38E19] pointer-events-none"
            style={dir === "rtl" ? { left: "10px" } : { right: "10px" }}
          />
        </div>
        </div>
      

      {/* Buttons */}
      <div className="flex justify-center gap-3">
        <button
          type="submit"
          className={`bg-[#b38e19] text-white w-24 h-10 rounded-md cursor-pointer font-${
            isArabic ? "cairo" : "roboto"
          } text-sm`}
        >
          {t("save")}
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