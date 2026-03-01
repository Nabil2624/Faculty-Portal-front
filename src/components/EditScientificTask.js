import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { FiCalendar } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "./ResponsiveLayoutProvider";

export default function EditScientificTask() {
  const location = useLocation();
  const taskData = location.state?.taskData || null;
  const { t, i18n } = useTranslation("add-scientific-task");
  const isArabic = i18n.language === "ar";
  const dir = i18n.dir();
  const navigate = useNavigate();

  const startDateNativeRef = useRef(null);
  const endDateNativeRef = useRef(null);

  const [taskName, setTaskName] = useState("");
  const [countryOrCity, setCountryOrCity] = useState("");
  const [universityOrFaculty, setUniversityOrFaculty] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Prefill form with existing data
  useEffect(() => {
    if (!taskData) return;

    setTaskName(taskData.missionName || "");
    setCountryOrCity(taskData.countryOrCity || "");
    setUniversityOrFaculty(taskData.universityOrFaculty || "");
    setDescription(taskData.notes || "");
    setStartDate(taskData.startDate || "");
    setEndDate(taskData.endDate || "");
  }, [taskData]);

  const openDatePicker = (ref) => {
    if (ref.current && typeof ref.current.showPicker === "function") {
      ref.current.showPicker();
    }
  };

  const inputBase =
    "w-full border border-gray-300 rounded-md px-4 py-2 placeholder-gray-400 bg-[#E2E2E2] outline-none transition-all duration-150 ease-linear text-[12px]";
  const focusStyle =
    "focus:border-gray-300 focus:shadow-[0_0_0_4px_rgba(179,142,25,0.5)]";

  const validateForm = () => {
    const newErrors = {};
    if (!taskName) newErrors.taskName = t("errors.taskRequired");
    if (!countryOrCity) newErrors.countryCity = t("errors.countryCityRequired");
    if (!startDate) newErrors.startDate = t("errors.startDateRequired");
    if (startDate && endDate && new Date(startDate) > new Date(endDate))
      newErrors.endDate = t("end_date_before_start");

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      await axiosInstance.put(
        `/Missions/UpdateScientificMission/${taskData.id}`,
        {
          missionName: taskName,
          countryOrCity,
          universityOrFaculty,
          startDate,
          endDate,
          notes: description,
        },
        { skipGlobalErrorHandler: true }
      );

      navigate("/scientific-missions");
    } catch (err) {
      console.error("Failed to update mission:", err);
      if (err.response?.data?.errorMessage) {
        setError(err.response.data.errorMessage);
      } else {
        setError(
          t("errors.failedUpdate") || "Failed to update scientific mission"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div dir={dir} className="p-4 sm:p-6 bg-white min-h-[calc(100vh-72px)]">
        <h2
          className={`text-2xl sm:text-3xl font-bold mb-8 inline-block text-start`}
        >
          {t("editTask.title") ||
            (isArabic ? "تعديل مهمة علمية" : "Edit Scientific Task")}
          <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
        </h2>

        {error && typeof error === "string" && (
          <p className="text-red-500 mb-4">{error}</p>
        )}
        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            <form className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 lg:gap-x-36 gap-y-6 w-full">
              {/* LEFT Column */}
              <div className="space-y-6">
                {/* Task Name */}
                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("fields.task")} <span className="text-[#b38e19]">*</span>
                  </label>
                  <input
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder={t("placeholders.task")}
                    className={`${inputBase} ${focusStyle}`}
                  />
                  {error.taskName && (
                    <p className="text-red-500 text-sm mt-1">{error.taskName}</p>
                  )}
                </div>

                {/* CountryOrCity */}
                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("fields.country_city")}{" "}
                    <span className="text-[#b38e19]">*</span>
                  </label>
                  <input
                    type="text"
                    value={countryOrCity}
                    onChange={(e) => setCountryOrCity(e.target.value)}
                    placeholder={t("placeholders.country_city")}
                    className={`${inputBase} ${focusStyle}`}
                  />
                  {error.countryCity && (
                    <p className="text-red-500 text-sm mt-1">{error.countryCity}</p>
                  )}
                </div>

                {/* UniversityOrFaculty */}
                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("fields.university_college")}
                  </label>
                  <input
                    type="text"
                    value={universityOrFaculty}
                    onChange={(e) => setUniversityOrFaculty(e.target.value)}
                    placeholder={t("placeholders.university_college")}
                    className={`${inputBase} ${focusStyle}`}
                  />
                </div>
              </div>

              {/* RIGHT Column */}
              <div className="space-y-6">
                {/* Dates */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-lg font-medium">
                      {t("fields.startDate")} <span className="text-[#b38e19]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={startDate}
                        placeholder={t("placeholders.startDate")}
                        readOnly
                        className={`${inputBase} ${focusStyle}`}
                        onClick={() => openDatePicker(startDateNativeRef)}
                      />
                      <FiCalendar
                        size={18}
                        onClick={() => openDatePicker(startDateNativeRef)}
                        className={`absolute top-1/2 -translate-y-1/2 text-[#B38E19] cursor-pointer ${
                          isArabic ? "left-3" : "right-3"
                        }`}
                      />
                      <input
                        type="date"
                        ref={startDateNativeRef}
                        className="absolute opacity-0 pointer-events-none"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    {error.startDate && (
                      <p className="text-red-500 text-sm mt-1">{error.startDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-lg font-medium">
                      {t("fields.endDate")}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={endDate}
                        placeholder={t("placeholders.endDate")}
                        readOnly
                        className={`${inputBase} ${focusStyle}`}
                        onClick={() => openDatePicker(endDateNativeRef)}
                      />
                      <FiCalendar
                        size={18}
                        onClick={() => openDatePicker(endDateNativeRef)}
                        className={`absolute top-1/2 -translate-y-1/2 text-[#B38E19] cursor-pointer ${
                          isArabic ? "left-3" : "right-3"
                        }`}
                      />
                      <input
                        type="date"
                        ref={endDateNativeRef}
                        className="absolute opacity-0 pointer-events-none"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                    {error.endDate && (
                      <p className="text-red-500 text-sm mt-1">{error.endDate}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("fields.description")}
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t("placeholders.description")}
                    className={`${inputBase} ${focusStyle} resize-none h-32`}
                  />
                </div>
              </div>
            </form>

            {/* Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-3 mt-40 justify-end ${
                isArabic ? "sm:pl-0" : "sm:pr-0"
              }`}
            >
              <button
                type="button"
                onClick={handleSave}
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
