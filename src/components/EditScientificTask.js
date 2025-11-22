import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { FiCalendar, FiChevronDown } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

export default function EditScientificTask() {
  const location = useLocation();
  const taskData = location.state?.taskData || null;
  const { t, i18n } = useTranslation("add-scientific-task");
  const isArabic = i18n.language === "ar";
  const startDateNativeRef = useRef(null);
  const endDateNativeRef = useRef(null);
  const navigate = useNavigate();

  // Initialize state with existing data (edit mode)
  const [taskName, setTaskName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [university, setUniversity] = useState("");
  const [college, setCollege] = useState("");

  // Load existing data into inputs
  useEffect(() => {
    if (taskData) {
      setTaskName(taskData.title || "");
      setCountry(taskData.location?.split("-")[1]?.trim() || "");
      setCity(taskData.location?.split("-")[0]?.trim() || "");
      setDescription(taskData.description || "");
      setUniversity(taskData.institution || "");
      setCollege(taskData.college || "");
      setStartDate(
        taskData.period?.split("-")[0]?.replace("من", "").trim() || ""
      );
      setEndDate(
        taskData.period?.split("-")[1]?.replace("حتى", "").trim() || ""
      );
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      taskName,
      country,
      city,
      description,
      startDate,
      endDate,
      university,
      college,
    };
    console.log("Submitted data:", formData);
    navigate("/scientific-missions");
  };

  return (
    <Layout>
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="p-4 sm:p-6 flex flex-col bg-white min-h-screen"
      >
        {/* Page Title */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-12 sm:mb-20 inline-block relative text-start">
          {t("editTask.title")}
          <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
        </h2>

        {/* Form */}
        <div className="flex flex-col items-center">
          <form className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 lg:gap-x-36 gap-y-6 w-full max-w-6xl">
            {/* LEFT Column */}
            <div className="space-y-6">
              {/* Task Name */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.task")} <span className="text-[#b38e19]">*</span>
                </label>
                <input
                  type="text"
                  className={`${inputBase} ${focusStyle}`}
                  placeholder={t("placeholders.task")}
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                />
              </div>

              {/* Country/City */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.country_city")}{" "}
                  <span className="text-[#b38e19]">*</span>
                </label>
                <input
                  type="text"
                  className={`${inputBase} ${focusStyle}`}
                  placeholder={t("placeholders.country_city")}
                  value={city && country ? `${city} - ${country}` : ""}
                  onChange={(e) => {
                    const [cCity, cCountry] = e.target.value.split(" - ");
                    setCity(cCity?.trim() || "");
                    setCountry(cCountry?.trim() || "");
                  }}
                />
              </div>
              {/* University/College */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.university_college")}
                </label>
                <input
                  type="text"
                  className={`${inputBase} ${focusStyle}`}
                  placeholder={t("placeholders.university_college")}
                  value={
                    university && college ? `${university} - ${college}` : ""
                  }
                  onChange={(e) => {
                    const [uni, col] = e.target.value.split(" - ");
                    setUniversity(uni?.trim() || "");
                    setCollege(col?.trim() || "");
                  }}
                />
              </div>
            </div>

            {/* RIGHT Column */}
            <div className="space-y-6">
              {/* Start Date + End Date */}
              <div className="grid grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="relative">
                  <label className="block mb-2 text-lg font-medium">
                    {t("fields.startDate")}{" "}
                    <span className="text-[#b38e19]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={startDate}
                      placeholder={t("placeholders.startDate")}
                      readOnly
                      className={`${inputBase} ${focusStyle}`}
                      onFocus={() => openDatePicker(startDateNativeRef)}
                    />
                    <FiCalendar
                      role="button"
                      aria-label="Open date picker"
                      onClick={() => openDatePicker(startDateNativeRef)}
                      size={18}
                      className={`absolute top-1/2 transform -translate-y-1/2 cursor-pointer text-[#B38E19] ${
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
                </div>

                {/* End Date */}
                <div className="relative">
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
                      onFocus={() => openDatePicker(endDateNativeRef)}
                    />
                    <FiCalendar
                      role="button"
                      aria-label="Open date picker"
                      onClick={() => openDatePicker(endDateNativeRef)}
                      size={18}
                      className={`absolute top-1/2 transform -translate-y-1/2 cursor-pointer text-[#B38E19] ${
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
                </div>
              </div>
              {/* Description */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.description")}
                </label>
                <textarea
                  rows="6"
                  className={`${inputBase} ${focusStyle} resize-none`}
                  placeholder={t("placeholders.description")}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </form>

          {/* Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-3 mt-6 sm:mt-10 justify-end  max-w-6xl absolute ${
              isArabic ? "left-[53px]" : "right-[53px]"
            } bottom-[28px]`}
          >
            <button
              type="submit"
              onClick={handleSubmit}
              className={`bg-[#b38e19] text-white sm:w-24 h-10 rounded-md cursor-pointer font-${
                isArabic ? "cairo" : "roboto"
              } text-sm`}
            >
              {t("buttons.save")}
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
    </Layout>
  );
}
