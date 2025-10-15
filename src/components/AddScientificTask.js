import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { FiCalendar, FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function AddScientificTask() {
  const { t, i18n } = useTranslation("add-scientific-task");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const startDateNativeRef = useRef(null);
  const endDateNativeRef = useRef(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const openDatePicker = (ref) => {
    if (ref.current && typeof ref.current.showPicker === "function") {
      ref.current.showPicker();
    }
  };

  const inputBase =
    "w-full border border-gray-300 rounded-md px-4 py-2 placeholder-gray-400 bg-[#E2E2E2] outline-none transition-all duration-150 ease-linear text-[12px]";

  const focusStyle =
    "focus:border-gray-300 focus:shadow-[0_0_0_4px_rgba(179,142,25,0.5)]";

  return (
    <Layout>
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="p-4 sm:p-6 flex flex-col bg-white min-h-screen"
      >
        {/* Page Title */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-12 sm:mb-19 inline-block relative text-start">
          {t("addTask.title")}
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
                  {t("fields.task")}
                </label>
                <input
                  type="text"
                  className={`${inputBase} ${focusStyle}`}
                  placeholder={t("placeholders.task")}
                />
              </div>

              {/* Country + City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Country */}
                <div className="relative">
                  <label className="block mb-2 text-lg font-medium">
                    {t("fields.country")}
                  </label>
                  <div className="relative">
                    <select
                      className={`${inputBase} ${focusStyle} appearance-none`}
                    >
                      <option value="">
                        {t("placeholders.selectCountry")}
                      </option>
                      <option>Egypt</option>
                      <option>USA</option>
                    </select>
                    <FiChevronDown
                      size={18}
                      className={`absolute text-[#B38E19] pointer-events-none top-1/2 transform -translate-y-1/2 ${
                        isArabic ? "left-3" : "right-3"
                      }`}
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("fields.city")}
                  </label>
                  <input
                    type="text"
                    className={`${inputBase} ${focusStyle}`}
                    placeholder={t("placeholders.city")}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.description")}
                </label>
                <textarea
                  rows="5"
                  className={`${inputBase} ${focusStyle} resize-none`}
                  placeholder={t("placeholders.description")}
                />
              </div>
            </div>

            {/* RIGHT Column */}
            <div className="space-y-6">
              {/* Start Date */}
              <div className="relative">
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.startDate")}
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
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {/* University */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.university")}
                </label>
                <input
                  type="text"
                  className={`${inputBase} ${focusStyle}`}
                  placeholder={t("placeholders.university")}
                />
              </div>

              {/* College */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.college")}
                </label>
                <input
                  type="text"
                  className={`${inputBase} ${focusStyle}`}
                  placeholder={t("placeholders.college")}
                />
              </div>
            </div>
          </form>

          {/* Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-3 mt-6 sm:mt-10 justify-end w-full max-w-6xl absolute ${
              isArabic ? "left-[53px]" : "right-[53px]"
            } bottom-[28px]`}
          >
            {/* Save Button */}
            <button
              type="button"
              onClick={() => navigate("/scientific-missions")}
              className={`bg-[#b38e19] text-white w-full sm:w-24 h-10 rounded-md cursor-pointer font-${
                isArabic ? "cairo" : "roboto"
              } text-sm`}
            >
              {t("buttons.save")}
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => navigate("/scientific-missions")}
              className={`bg-gray-300 text-black w-full sm:w-24 h-10 rounded-md cursor-pointer font-${
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
