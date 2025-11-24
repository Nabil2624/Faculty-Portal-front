import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export default function AddProject() {
  const { t, i18n } = useTranslation("AddProject");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const [projectName, setProjectName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [projectType, setProjectType] = useState("");
  const [role, setRole] = useState("");
  const [nationality, setNationality] = useState("دولي");
  const [fundingSource, setFundingSource] = useState("");

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
        <h2 className="text-2xl sm:text-3xl font-bold mb-12 sm:mb-19 inline-block relative text-start">
          {t("title")}
          <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
        </h2>

        <div className="flex flex-col items-center">
          <form className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 lg:gap-x-36 gap-y-6 w-full max-w-6xl">
            {/* LEFT Column */}
            <div className="space-y-6">
             

              {/* Project Nationality */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.nationality")} 
                </label>
                <div className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name="nationality"
                      value="دولي"
                      checked={nationality === "دولي"}
                      onChange={(e) => setNationality(e.target.value)}
                      className="mr-2"
                    />
                    {t("options.international")}
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="nationality"
                      value="محلي"
                      checked={nationality === "محلي"}
                      onChange={(e) => setNationality(e.target.value)}
                      className="mr-2"
                    />
                    {t("options.local")}
                  </label>
                </div>
              </div>
               {/* Project Name */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.projectName")} <span className="text-[#b38e19]">*</span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder={t("placeholders.projectName")}
                  className={`${inputBase} ${focusStyle}`}
                />
              </div>

              {/* Project Type */}
              <div>
                <label className="block mb-2 text-lg font-medium">{t("fields.projectType")} <span className="text-[#B38E19]">*</span></label>
                <div className="relative flex items-center">
                  <select
                    className={`${inputBase} ${focusStyle} appearance-none flex-1`}
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                  >
                    <option value="" disabled>{t("placeholders.projectType")}</option>
                    <option value="بحثي">{t("options.research")}</option>
                    <option value="تطوير">{t("options.development")}</option>
                    <option value="تعليمي">{t("options.educational")}</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute text-[#B38E19] pointer-events-none"
                    style={isArabic ? { left: "10px" } : { right: "10px" }}
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.role")} <span className="text-[#b38e19]">*</span>
                </label>
                <div className="relative flex items-center">
                  <select
                    className={`${inputBase} ${focusStyle} appearance-none flex-1`}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="" disabled>{t("placeholders.role")}</option>
                    <option value="رئيس الفريق">{t("options.teamLeader")}</option>
                    <option value="عضو الفريق">{t("options.teamMember")}</option>
                    <option value="مستشار">{t("options.consultant")}</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute text-[#B38E19] pointer-events-none"
                    style={isArabic ? { left: "10px" } : { right: "10px" }}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT Column */}
            <div className="space-y-6">
              {/* Start + End Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block mb-2 text-lg font-medium">{t("fields.startDate")} <span className="text-[#B38E19]">*</span></label>
                  <div className="relative">
                    <input
                      type="text"
                      value={startDate}
                      placeholder={t("placeholders.startDate")}
                      readOnly
                      className={`${inputBase} ${focusStyle}`}
                      onFocus={() => openDatePicker(startDateRef)}
                    />
                    <FiCalendar
                      role="button"
                      onClick={() => openDatePicker(startDateRef)}
                      size={18}
                      className={`absolute top-1/2 transform -translate-y-1/2 cursor-pointer text-[#B38E19] ${
                        isArabic ? "left-3" : "right-3"
                      }`}
                    />
                    <input
                      type="date"
                      ref={startDateRef}
                      className="absolute opacity-0 pointer-events-none"
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block mb-2 text-lg font-medium">{t("fields.endDate")}</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={endDate}
                      placeholder={t("placeholders.endDate")}
                      readOnly
                      className={`${inputBase} ${focusStyle}`}
                      onFocus={() => openDatePicker(endDateRef)}
                    />
                    <FiCalendar
                      role="button"
                      onClick={() => openDatePicker(endDateRef)}
                      size={18}
                      className={`absolute top-1/2 transform -translate-y-1/2 cursor-pointer text-[#B38E19] ${
                        isArabic ? "left-3" : "right-3"
                      }`}
                    />
                    <input
                      type="date"
                      ref={endDateRef}
                      className="absolute opacity-0 pointer-events-none"
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Funding Source */}
              <div>
                <label className="block mb-2 text-lg font-medium">{t("fields.funding")} <span className="text-[#B38E19]">*</span></label>
                <input
                  type="text"
                  value={fundingSource}
                  onChange={(e) => setFundingSource(e.target.value)}
                  placeholder={t("placeholders.funding")}
                  className={`${inputBase} ${focusStyle}`}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 text-lg font-medium">{t("fields.description")}</label>
                <textarea
                  rows="6"
                  className={`${inputBase} ${focusStyle} resize-none`}
                  placeholder={t("placeholders.description")}
                />
              </div>
            </div>
          </form>

          {/* Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-3 mt-6 sm:mt-10 justify-end max-w-6xl absolute ${
              isArabic ? "left-[53px]" : "right-[53px]"
            } bottom-[28px]`}
          >
            <button
              type="button"
              onClick={() => navigate("/projects")}
              className={`bg-[#b38e19] text-white sm:w-24 h-10 rounded-md cursor-pointer font-${
                isArabic ? "cairo" : "roboto"
              } text-sm`}
            >
              {t("buttons.save")}
            </button>
            <button
              type="button"
              onClick={() => navigate("/projects")}
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