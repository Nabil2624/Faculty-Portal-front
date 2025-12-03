import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, ChevronDown, Pen } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

export default function EditJobGrade({ data, onCancel, onSuccess }) {
  const { t, i18n } = useTranslation("form");
  const dir = i18n.dir();
  const isArabic = i18n.language === "ar";

  const [formData, setFormData] = useState({
    jobGrade: "",
    gradeDate: "",
    notes: "",
  });
  const [degrees, setDegrees] = useState([]);
  const [loadingDegrees, setLoadingDegrees] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const gradeDateRef = useRef(null);
  const [gradeFocused, setGradeFocused] = useState(false);

  // Fetch Employment Degrees
  const fetchDegrees = async () => {
    try {
      setLoadingDegrees(true);
      const response = await axiosInstance.get("/LookUpItems/EmploymentDegrees", { skipGlobalErrorHandler: true });
      setDegrees(response.data || []);
    } catch (err) {
      console.error("Failed to fetch degrees:", err);
      setErrors((prev) => ({ ...prev, degrees: t("fetchDegreesError") }));
    } finally {
      setLoadingDegrees(false);
    }
  };

  useEffect(() => {
    fetchDegrees();
  }, []);

  // Fill form with existing data
  useEffect(() => {
    if (data && data.jobRank) {
      setFormData({
        jobGrade: data.jobRank.id || "", // هذا هو الـ id الحقيقي للـ select
        gradeDate: data.dateOfJobRank || "",
        notes: data.notes || "",
      });
    }
  }, [data]);

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
    const errs = {};
    if (!formData.jobGrade) errs.jobGrade = t("required");
    if (!formData.gradeDate) errs.gradeDate = t("required");
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    try {
      setLoading(true);
      const payload = {
        jobRankId: formData.jobGrade, // هنا نرسل id صحيح من الـ dropdown
        dateOfJobRank: formData.gradeDate,
        notes: formData.notes || "",
      };

      await axiosInstance.put(`/ScientificProgression/UpdateJobRank/${data.id}`, payload, {
        skipGlobalErrorHandler: true,
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Failed to update job rank:", err);
      setErrors({ api: t("submitError") });
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
        <h2 className="text-xl font-semibold text-gray-800">{t("edit_job_grade")}</h2>
      </div>

      {/* Job Grade */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">{t("job_grade")}</label>
        <div className="relative">
          {loadingDegrees ? (
            <p className="text-gray-500">{t("loading")}</p>
          ) : (
            <>
              <select
                name="jobGrade"
                value={formData.jobGrade}
                onChange={handleChange}
                className={`${inputClass} ${focusClasses} appearance-none`}
              >
                <option value="">{t("select_job_grade")}</option>
                {degrees.map((deg) => (
                  <option key={deg.id} value={deg.id}>
                    {isArabic ? deg.valueAr : deg.valueEn}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                className="absolute top-2.5 text-[#B38E19] pointer-events-none"
                style={dir === "rtl" ? { left: "10px" } : { right: "10px" }}
              />
            </>
          )}
        </div>
        {errors.jobGrade && <p className="text-red-500 text-sm mt-1">{errors.jobGrade}</p>}
        {errors.degrees && <p className="text-red-500 text-sm mt-1">{errors.degrees}</p>}
      </div>

      {/* Job Grade Date */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">{t("grade_date")}</label>
        <div className="relative">
          <input
            type="text"
            name="gradeDate"
            value={formData.gradeDate}
            readOnly
            onClick={() => openDatePicker(gradeDateRef)}
            className={`${inputClass} ${focusClasses} ${gradeFocused ? "ring-2 ring-[#B38E19]" : ""} cursor-pointer`}
            placeholder={t("select_grade_date")}
          />
          <input
            ref={gradeDateRef}
            type="date"
            value={formData.gradeDate}
            onChange={(e) => setFormData((p) => ({ ...p, gradeDate: e.target.value }))}
            onFocus={() => setGradeFocused(true)}
            onBlur={() => setGradeFocused(false)}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
            tabIndex={-1}
            aria-hidden="true"
          />
          <Calendar
            size={18}
            className="absolute top-2.5 text-[#B38E19] cursor-pointer z-20"
            style={dir === "rtl" ? { left: "10px" } : { right: "10px" }}
            onClick={() => openDatePicker(gradeDateRef)}
          />
        </div>
        {errors.gradeDate && <p className="text-red-500 text-sm mt-1">{errors.gradeDate}</p>}
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">{t("notes")}</label>
        <textarea
          name="notes"
          rows="3"
          value={formData.notes}
          onChange={handleChange}
          placeholder={t("notes_placeholder")}
          className={`${inputClass} ${focusClasses} bg-[#f5f5f5] resize-none text-gray-600`}
        ></textarea>
      </div>

      {errors.api && <p className="text-red-500 text-center mb-4">{errors.api}</p>}

      <div className="flex justify-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className={`bg-[#b38e19] text-white w-24 h-10 rounded-md cursor-pointer font-${isArabic ? "cairo" : "roboto"} text-sm`}
        >
          {loading ? t("updating") : t("edit")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={`bg-gray-300 text-black w-24 h-10 rounded-md cursor-pointer font-${isArabic ? "cairo" : "roboto"} text-sm`}
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}
