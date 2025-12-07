// src/pages/AddScientificTask.jsx
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider"

export default function AddScientificTask() {
  const { t, i18n } = useTranslation("add-scientific-task");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    CountryOrCity: "",
    UniversityOrFaculty: "",
    startDate: "",
    endDate: "",
    Description: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const openDatePicker = (ref) => {
    if (ref.current && typeof ref.current.showPicker === "function") {
      ref.current.showPicker();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t("required_task_name");
    if (!formData.CountryOrCity.trim())
      newErrors.CountryOrCity = t("required_country_city");
    if (!formData.startDate.trim())
      newErrors.startDate = t("required_start_date");
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      const response = await axiosInstance.post(
        "/Missions/CreateScientificMission",
        formData,
        { skipGlobalErrorHandler: true }
      );

      if (response.status === 200 && response.data?.id) {
        navigate("/scientific-missions");
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

  const inputBase =
    "w-full border border-gray-300 rounded-md px-4 py-2 placeholder-gray-400 bg-[#E2E2E2] outline-none transition-all duration-150 ease-linear text-[12px]";
  const focusStyle =
    "focus:border-gray-300 focus:shadow-[0_0_0_4px_rgba(179,142,25,0.5)]";

  return (
    <ResponsiveLayoutProvider>
      <div dir={isArabic ? "rtl" : "ltr"} className="p-4 sm:p-6 bg-white min-h-[calc(100vh-72px)]">

        {/* العنوان خارج الفورم، على اليسار/اليمين */}
        <h2 className={`text-2xl sm:text-3xl font-bold mb-8 inline-block text-start`}>
          {t("addTask.title")}
          <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
        </h2>

        {/* الفورم المركزي */}
        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 lg:gap-x-36 gap-y-6 w-full"
            >
              {/* LEFT Column */}
              <div className="space-y-6">
                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("fields.task")} <span className="text-[#b38e19]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`${inputBase} ${focusStyle}`}
                    placeholder={t("placeholders.task")}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("fields.country_city")}{" "}
                    <span className="text-[#b38e19]">*</span>
                  </label>
                  <input
                    type="text"
                    name="CountryOrCity"
                    value={formData.CountryOrCity}
                    onChange={handleChange}
                    className={`${inputBase} ${focusStyle}`}
                    placeholder={t("placeholders.country_city")}
                  />
                  {errors.CountryOrCity && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.CountryOrCity}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("fields.university_college")}
                  </label>
                  <input
                    type="text"
                    name="UniversityOrFaculty"
                    value={formData.UniversityOrFaculty}
                    onChange={handleChange}
                    className={`${inputBase} ${focusStyle}`}
                    placeholder={t("placeholders.university_college")}
                  />
                </div>
              </div>

              {/* RIGHT Column */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-lg font-medium">
                      {t("fields.startDate")} <span className="text-[#b38e19]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.startDate}
                        name="startDate"
                        readOnly
                        placeholder={t("placeholders.startDate")}
                        onClick={() => openDatePicker(startDateRef)}
                        className={`${inputBase} ${focusStyle}`}
                      />
                      <FiCalendar
                        size={18}
                        className={`absolute top-1/2 -translate-y-1/2 cursor-pointer text-[#B38E19] ${
                          isArabic ? "left-3" : "right-3"
                        }`}
                        onClick={() => openDatePicker(startDateRef)}
                      />
                      <input
                        type="date"
                        ref={startDateRef}
                        className="absolute opacity-0"
                        onChange={(e) =>
                          setFormData({ ...formData, startDate: e.target.value })
                        }
                      />
                    </div>
                    {errors.startDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-lg font-medium">
                      {t("fields.endDate")}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.endDate}
                        name="endDate"
                        readOnly
                        placeholder={t("placeholders.endDate")}
                        onClick={() => openDatePicker(endDateRef)}
                        className={`${inputBase} ${focusStyle}`}
                      />
                      <FiCalendar
                        size={18}
                        className={`absolute top-1/2 -translate-y-1/2 cursor-pointer text-[#B38E19] ${
                          isArabic ? "left-3" : "right-3"
                        }`}
                        onClick={() => openDatePicker(endDateRef)}
                      />
                      <input
                        type="date"
                        ref={endDateRef}
                        className="absolute opacity-0"
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("fields.description")}
                  </label>
                  <textarea
                    rows="6"
                    name="Description"
                    value={formData.Description}
                    onChange={handleChange}
                    className={`${inputBase} ${focusStyle} resize-none`}
                    placeholder={t("placeholders.description")}
                  />
                </div>
              </div>
            </form>

            {errors.submit && (
              <p className="text-red-500 text-center mt-4">{errors.submit}</p>
            )}

            <div
              className={`flex flex-col sm:flex-row gap-3 mt-40 justify-end ${
                isArabic ? "sm:pl-0" : "sm:pr-0"
              }`}
            >
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`bg-[#b38e19] text-white sm:w-24 h-10 rounded-md cursor-pointer font-${
                  isArabic ? "cairo" : "roboto"
                } text-sm`}
              >
                {loading ? t("loading") : t("buttons.save")}
              </button>

              <button
                type="button"
                onClick={() => navigate("/scientific-missions")}
                className={`bg-gray-300 text-black sm:w-24 h-10 rounded-md cursor-pointer font-${
                  isArabic ? "cairo" : "roboto"
                } text-sm`}
              >
                {t("buttons.cancel")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
}
