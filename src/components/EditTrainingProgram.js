import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { FiCalendar } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";

export default function EditTrainingProgram() {
  const location = useLocation();
  const navigate = useNavigate();
  const existingData = location.state?.programData || {};
  const { t, i18n } = useTranslation("add-training-program");
  const isArabic = i18n.language === "ar";
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const [formData, setFormData] = useState({
    id: "",
    programType: null,
    participationType: null,
    programName: "",
    organizingAuthority: "",
    venue: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (existingData) {
      setFormData({
        id: existingData.id,
        programType:
          existingData.type === "InTheSpecialty"
            ? 1 // داخل التخصص → specialist
            : existingData.type === "OutTheSpecialty"
              ? 2 // خارج التخصص → general
              : null,
        participationType:
          existingData.participationType === "listener"
            ? 1
            : existingData.participationType === "lecturer"
              ? 2
              : null,
        programName: existingData.trainingProgramName || "",
        organizingAuthority: existingData.organizingAuthority || "",
        venue: existingData.venue || "",
        description: existingData.description || "",
        startDate: existingData.startDate || "",
        endDate: existingData.endDate || "",
      });
    }
  }, [existingData]);

  const inputBase =
    "w-full border border-gray-300 rounded-md px-4 py-2 placeholder-gray-400 bg-[#E2E2E2] outline-none text-[12px] transition-all duration-150 ease-linear";
  const focusStyle =
    "focus:border-gray-300 focus:shadow-[0_0_0_4px_rgba(179,142,25,0.5)]";

  const openDatePicker = (ref) => {
    if (ref.current?.showPicker) ref.current.showPicker();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "programType" || name === "participationType"
          ? Number(value)
          : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.programType)
      newErrors.programType = t("errors.programTypeRequired");
    if (!formData.participationType)
      newErrors.participationType = t("errors.participationTypeRequired");
    if (!formData.programName)
      newErrors.programName = t("errors.programNameRequired");
    if (!formData.organizingAuthority)
      newErrors.organizingAuthority = t("errors.organizingBodyRequired");
    if (!formData.venue) newErrors.venue = t("errors.locationRequired");
    if (!formData.startDate)
      newErrors.startDate = t("errors.startDateRequired");
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start > end) newErrors.endDate = t("errors.startBeforeEnd");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axiosInstance.put(
        `/Missions/UpdateTrainingProgram/${formData.id}`,
        {
          type: formData.programType,
          participationType: formData.participationType,
          trainingProgramName: formData.programName,
          organizingAuthority: formData.organizingAuthority,
          venue: formData.venue,
          startDate: formData.startDate,
          endDate: formData.endDate,
          description: formData.description,
        },
      );
      navigate("/training-programs");
    } catch (err) {
      console.error("Failed to update training program:", err);
      setErrors({ submit: t("errors.failedAdd") });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/training-programs");

  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="p-4 sm:p-6 bg-white min-h-[calc(100vh-72px)] flex flex-col items-center"
      >
        <h2
          className={`text-2xl sm:text-3xl font-bold mb-8 w-full ${
            isArabic ? "text-right" : "text-left"
          }`}
        >
          {t("editTrainingProgram")}
          <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
        </h2>
        <div className="w-full max-w-6xl">
          <form className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 lg:gap-x-36 gap-y-6 w-full">
            {/* LEFT Column */}
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:gap-6">
                {/* Program Type */}

                <div className="flex-1 mb-4 lg:mb-0">
                  <label className="block mb-2 text-lg font-medium">
                    {t("programType")} <span className="text-[#b38e19]">*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="programType"
                        value={1}
                        checked={formData.programType === 1}
                        onChange={handleChange}
                        className="accent-[#B38E19]"
                      />
                      {t("specialist")}
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="programType"
                        value={2}
                        checked={formData.programType === 2}
                        onChange={handleChange}
                        className="accent-[#B38E19]"
                      />
                      {t("general")}
                    </label>
                  </div>
                  {errors.programType && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.programType}
                    </p>
                  )}
                </div>

                {/* Participation Type */}
                <div className="flex-1">
                  <label className="block mb-2 text-lg font-medium">
                    {t("participationType")}{" "}
                    <span className="text-[#b38e19]">*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="participationType"
                        value={1}
                        checked={formData.participationType === 1}
                        onChange={handleChange}
                        className="accent-[#B38E19]"
                      />
                      {t("internal")}
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="participationType"
                        value={2}
                        checked={formData.participationType === 2}
                        onChange={handleChange}
                        className="accent-[#B38E19]"
                      />
                      {t("external")}
                    </label>
                  </div>
                  {errors.participationType && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.participationType}
                    </p>
                  )}
                </div>
              </div>
              {/* Program Name */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("programName")} <span className="text-[#b38e19]">*</span>
                </label>
                <input
                  type="text"
                  name="programName"
                  value={formData.programName}
                  onChange={handleChange}
                  placeholder={t("programNamePlaceholder")}
                  className={`${inputBase} ${focusStyle}`}
                />
                {errors.programName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.programName}
                  </p>
                )}
              </div>

              {/* Organizing Authority */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("organizingBody")}{" "}
                  <span className="text-[#b38e19]">*</span>
                </label>
                <input
                  type="text"
                  name="organizingAuthority"
                  value={formData.organizingAuthority}
                  onChange={handleChange}
                  placeholder={t("organizingBodyPlaceholder")}
                  className={`${inputBase} ${focusStyle}`}
                />
                {errors.organizingAuthority && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.organizingAuthority}
                  </p>
                )}
              </div>

              {/* Venue */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {isArabic ? "مكان الانعقاد" : "Location"}{" "}
                  <span className="text-[#b38e19]">*</span>
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder={
                    isArabic ? "اكتب مكان الانعقاد" : "Enter location"
                  }
                  className={`${inputBase} ${focusStyle}`}
                />
                {errors.venue && (
                  <p className="text-red-500 text-xs mt-1">{errors.venue}</p>
                )}
              </div>
            </div>

            {/* RIGHT Column */}
            <div className="space-y-6">
              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("startDate")} <span className="text-[#b38e19]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={formData.startDate}
                      placeholder={t("startDatePlaceholder")}
                      className={`${inputBase} ${focusStyle}`}
                      onFocus={() => openDatePicker(startDateRef)}
                    />
                    <FiCalendar
                      onClick={() => openDatePicker(startDateRef)}
                      className={`absolute top-1/2 -translate-y-1/2 cursor-pointer text-[#B38E19] ${
                        isArabic ? "left-3" : "right-3"
                      }`}
                    />
                    <input
                      type="date"
                      ref={startDateRef}
                      className="absolute opacity-0 pointer-events-none"
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                    />
                  </div>
                  {errors.startDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("endDate")}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={formData.endDate}
                      placeholder={t("endDatePlaceholder")}
                      className={`${inputBase} ${focusStyle}`}
                      onFocus={() => openDatePicker(endDateRef)}
                    />
                    <FiCalendar
                      onClick={() => openDatePicker(endDateRef)}
                      className={`absolute top-1/2 -translate-y-1/2 cursor-pointer text-[#B38E19] ${
                        isArabic ? "left-3" : "right-3"
                      }`}
                    />
                    <input
                      type="date"
                      ref={endDateRef}
                      className="absolute opacity-0 pointer-events-none"
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                    />
                  </div>
                  {errors.endDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("description")}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={t("descriptionPlaceholder")}
                  className={`${inputBase} ${focusStyle} h-32 resize-none`}
                />
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <p className="text-red-500 text-center col-span-2 mt-2">
                {errors.submit}
              </p>
            )}
          </form>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-[77px] justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              className={`bg-[#b38e19] text-white sm:w-24 h-10 rounded-md cursor-pointer font-${
                isArabic ? "cairo" : "roboto"
              } text-sm`}
            >
              {t("save")}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={`bg-gray-300 text-black sm:w-24 h-10 rounded-md cursor-pointer font-${
                isArabic ? "cairo" : "roboto"
              } text-sm`}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
}
