import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, Pen } from "lucide-react";
import axiosInstance from "../../../utils/axiosInstance";

export default function EditAdminPosition({ data, onCancel, onSuccess }) {
  const { t, i18n } = useTranslation("form");
  const dir = i18n.dir();
  const isArabic = i18n.language === "ar";

  const [formData, setFormData] = useState({
    jobGrade: "",
    startDate: "",
    endDate: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (data) {
      setFormData({
        jobGrade: data.position || "",
        startDate: data.startDate || "",
        endDate: data.endDate || "",
        notes: data.notes || "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!data?.id) {
      setError(t("updateError") || "Failed to update position");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.put(
        `/ScientificProgression/UpdateAdministrativePosition/${data.id}`,
        {
          id: data.id,
          position: formData.jobGrade,
          startDate: formData.startDate,
          endDate: formData.endDate,
          notes: formData.notes,
        },
        { skipGlobalErrorHandler: true },
      );

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError(t("updateError") || "Failed to update position");
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
      style={{
        width: "clamp(320px, 32vw, 600px)",
        padding: "clamp(1rem, 2.5vw, 2rem)",
        borderRadius: "clamp(12px, 1.8vw, 22px)",
      }}
      className="bg-[#EDEDED] border-2 border-[#b38e19] shadow-sm mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-center mb-6">
        <Pen className="text-[#B38E19] mx-1" size={20} />
        <h2 className="text-xl font-semibold text-gray-800">
          {t("edit_admin_pos")}
        </h2>
      </div>

      {/* Error */}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {/* Job Position as input */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t("admin_pos")}
        </label>
        <input
          type="text"
          name="jobGrade"
          value={formData.jobGrade}
          onChange={handleChange}
          placeholder={t("position_placeholder") || "Enter the position name"}
          className={`${inputClass} ${focusClasses}`}
        />
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

      {/* Buttons */}
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
