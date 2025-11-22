import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, ChevronDown, Pen } from "lucide-react";

export default function EditAdminPosition({ data, onCancel }) {
  const { t, i18n } = useTranslation("form");
  const dir = i18n.dir();
  const isArabic = i18n.language === "ar";

  const [formData, setFormData] = useState({
    jobGrade: "",
    startDate: "",
    endDate: "",
    notes: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        jobGrade: data.title || "",
        startDate: data.startDate || "",
        endDate: data.endDate || "",
        notes: data.description || "",
      });
    }
  }, [data]);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const [startFocused, setStartFocused] = useState(false);
  const [endFocused, setEndFocused] = useState(false);

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
        <Pen className="text-[#B38E19] mx-1" size={20} />
        <h2 className="text-xl font-semibold text-gray-800">
          {t("edit_admin_pos")}
        </h2>
      </div>

      {/* Job Grade */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t("admin_pos")}
        </label>
        <div className="relative">
          <select
            name="jobGrade"
            value={formData.jobGrade}
            onChange={handleChange}
            className={`${inputClass} ${focusClasses} appearance-none`}
          >
            <option value="">{t("select_job_grade")}</option>
            <option value="grade1">Grade 1</option>
            <option value="grade2">Grade 2</option>
            <option value="grade3">Grade 3</option>
          </select>
          <ChevronDown
            size={18}
            className="absolute top-2.5 text-[#B38E19] pointer-events-none"
            style={dir === "rtl" ? { left: "10px" } : { right: "10px" }}
          />
        </div>
      </div>

      {/* Start Date */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t("start_date")}
        </label>
        <div className="relative">
          <input
            type="text"
            name="startDate"
            value={formData.startDate}
            readOnly
            onClick={() => openDatePicker(startDateRef)}
            className={`${inputClass} ${focusClasses} ${
              startFocused ? "ring-2 ring-[#B38E19]" : ""
            } cursor-pointer`}
            placeholder={t("select_start_date")}
          />

          <input
            ref={startDateRef}
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData((p) => ({ ...p, startDate: e.target.value }))
            }
            onFocus={() => setStartFocused(true)}
            onBlur={() => setStartFocused(false)}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
            style={{ colorScheme: "light" }}
            aria-hidden="true"
            tabIndex={-1}
          />

          <Calendar
            size={18}
            className="absolute top-2.5 text-[#B38E19] cursor-pointer z-20"
            style={dir === "rtl" ? { left: "10px" } : { right: "10px" }}
            onClick={() => openDatePicker(startDateRef)}
          />
        </div>
      </div>

      {/* End Date */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t("end_date")}
        </label>
        <div className="relative">
          <input
            type="text"
            name="endDate"
            value={formData.endDate}
            readOnly
            onClick={() => openDatePicker(endDateRef)}
            className={`${inputClass} ${focusClasses} ${
              endFocused ? "ring-2 ring-[#B38E19]" : ""
            } cursor-pointer`}
            placeholder={t("select_end_date")}
          />

          <input
            ref={endDateRef}
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData((p) => ({ ...p, endDate: e.target.value }))
            }
            onFocus={() => setEndFocused(true)}
            onBlur={() => setEndFocused(false)}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
            style={{ colorScheme: "light" }}
            aria-hidden="true"
            tabIndex={-1}
          />

          <Calendar
            size={18}
            className="absolute top-2.5 text-[#B38E19] cursor-pointer z-20"
            style={dir === "rtl" ? { left: "10px" } : { right: "10px" }}
            onClick={() => openDatePicker(endDateRef)}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t("notes")}
        </label>
        <textarea
          name="notes"
          rows="3"
          value={formData.notes}
          onChange={handleChange}
          placeholder={t("notes_placeholder")}
          className={`${inputClass} ${focusClasses} bg-[#f5f5f5] resize-none text-gray-600`}
        ></textarea>
      </div>

      {/* Buttons (same as EditJobGrade) */}
      <div className="flex justify-center gap-3">
        <button
          type="submit"
          className={`bg-[#b38e19] text-white w-24 h-10 rounded-md cursor-pointer font-${
            isArabic ? "cairo" : "roboto"
          } text-sm`}
        >
          {t("edit") || "Edit"}
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
