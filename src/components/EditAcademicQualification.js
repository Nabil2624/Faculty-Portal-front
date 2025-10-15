// src/pages/EditAcademicQualification.jsx
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { FiCalendar, FiChevronDown } from "react-icons/fi";
import { Info, ExternalLink } from "lucide-react";

export default function EditAcademicQualification({ existingData }) {
  const { t, i18n } = useTranslation("add-academic-qualification");
  const isArabic = i18n.language === "ar";

  const graduationDateRef = useRef(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    degree: "",
    specialization: "",
    delegation: "",
    grade: "",
    graduationDate: "",
    country: "",
    city: "",
    university: "",
    college: "",
    attachments: null,
  });

  useEffect(() => {
    if (existingData) {
      setFormData((prev) => ({
        ...prev,
        degree: existingData.degree || "",
        specialization: existingData.specialization || "",
        delegation: existingData.delegation || "",
        grade: existingData.grade || "",
        graduationDate: existingData.graduationDate || "",
        country: existingData.country || "",
        city: existingData.city || "",
        university: existingData.university || "",
        college: existingData.college || "",
      }));
    }
  }, [existingData]);

  const openDatePicker = () => {
    if (graduationDateRef.current && typeof graduationDateRef.current.showPicker === "function") {
      graduationDateRef.current.showPicker();
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const inputBase =
    "w-full border border-gray-300 rounded-md px-4 py-2 placeholder-gray-400 bg-[#E2E2E2] outline-none transition-all duration-150 ease-linear text-[12px]";
  const focusStyle =
    "focus:border-gray-300 focus:shadow-[0_0_0_4px_rgba(179,142,25,0.5)]";

  return (
    <Layout>
      <div dir={isArabic ? "rtl" : "ltr"} className="p-4 sm:p-6 bg-white min-h-screen">
        {/* Page Title */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-12 sm:mb-19 inline-block w-full max-w-6xl">
          {t("edit-academic-qualification")}
          <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
        </h2>

        {/* Form container */}
        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 lg:gap-x-36 gap-y-6 w-full max-w-6xl relative"
          >
            {/* LEFT Column */}
            <div className="space-y-6">
              {/* Degree */}
              <div>
                <label className="block mb-2 text-lg font-medium">{t("degree")}</label>
                <div className="relative flex items-center">
                  <select
                    name="degree"
                    className={`${inputBase} ${focusStyle} appearance-none flex-1`}
                    value={formData.degree}
                    onChange={handleChange}
                  >
                    <option value="">{t("selectDegree")}</option>
                    <option value="bachelor">{t("bachelor")}</option>
                    <option value="master">{t("master")}</option>
                    <option value="phd">{t("phd")}</option>
                  </select>
                  <FiChevronDown
                    size={18}
                    className={`absolute text-[#B38E19] pointer-events-none ${
                      isArabic ? "left-4" : "right-4"
                    }`}
                  />
                </div>
              </div>

              {/* Delegation */}
              <div>
                <label className="block mb-2 text-lg font-medium">{t("delegation")}</label>
                <div className="relative flex items-center">
                  <select
                    name="delegation"
                    className={`${inputBase} ${focusStyle} appearance-none flex-1`}
                    value={formData.delegation}
                    onChange={handleChange}
                  >
                    <option value="">{t("delegation-placeholder")}</option>
                    <option value="internal">Egypt</option>
                    <option value="external">USA</option>
                    <option value="selfStudy"></option>
                  </select>
                  <FiChevronDown
                    size={18}
                    className={`absolute text-[#B38E19] pointer-events-none ${
                      isArabic ? "left-4" : "right-4"
                    }`}
                  />
                </div>
              </div>

              {/* Country + City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Country */}
                <div>
                  <label className="block mb-2 text-lg font-medium">{t("country")}</label>
                  <div className="relative flex items-center">
                    <select
                      name="country"
                      className={`${inputBase} ${focusStyle} appearance-none flex-1`}
                      value={formData.country}
                      onChange={handleChange}
                    >
                      <option value="">{t("selectCountry")}</option>
                      <option value="egypt">Egypt</option>
                      <option value="usa">USA</option>
                    </select>
                    <FiChevronDown
                      size={18}
                      className={`absolute text-[#B38E19] pointer-events-none ${
                        isArabic ? "left-4" : "right-4"
                      }`}
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block mb-2 text-lg font-medium">{t("city")}</label>
                  <input
                    type="text"
                    name="city"
                    placeholder={t("cityPlaceholder")}
                    className={`${inputBase} ${focusStyle}`}
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* University */}
              <div>
                <label className="block mb-2 text-lg font-medium">{t("university")}</label>
                <input
                  type="text"
                  name="university"
                  placeholder={t("universityPlaceholder")}
                  className={`${inputBase} ${focusStyle}`}
                  value={formData.university}
                  onChange={handleChange}
                />
              </div>

              {/* Attachments */}
              <div>
                <label className="block mb-2 text-lg font-medium">{t("attachments")}</label>
                <div className="flex items-start gap-2 mb-2">
                  <Info size={17} className="text-gray-600 mt-1" />
                  <p className="text-yellow-600 text-sm">{t("subtitle")}</p>
                </div>

                <input
                  type="file"
                  name="attachments"
                  accept=".pdf,.jpg,.png"
                  ref={fileInputRef}
                  onChange={handleChange}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    className="bg-[#19355A] text-white px-9 py-1 rounded-md hover:bg-[#162d4a] transition-colors"
                  >
                    {t("chooseFile")}
                  </button>

                  {existingData?.attachmentUrl && (
                    <a
                      href={existingData.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-black hover:underline"
                    >
                      {existingData.attachmentName || t("currentFile")}
                      <ExternalLink
                        size={16}
                        className={`ml-1 ${isArabic ? "rtl:ml-0 rtl:mr-1" : ""}`}
                      />
                    </a>
                  )}

                  {formData.attachments && (
                    <button
                      type="button"
                      onClick={() => window.open(URL.createObjectURL(formData.attachments))}
                      className="flex items-center text-sm text-black hover:underline"
                    >
                      {formData.attachments.name}
                      <ExternalLink
                        size={16}
                        className={`ml-1 ${isArabic ? "rtl:ml-0 rtl:mr-1" : ""}`}
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT Column */}
            <div className="space-y-6">
              {/* Specialization */}
              <div>
                <label className="block mb-2 text-lg font-medium">{t("specialization")}</label>
                <input
                  type="text"
                  name="specialization"
                  placeholder={t("specializationPlaceholder")}
                  className={`${inputBase} ${focusStyle}`}
                  value={formData.specialization}
                  onChange={handleChange}
                />
              </div>

              {/* Grade */}
              <div>
                <label className="block mb-2 text-lg font-medium">{t("grade")}</label>
                <div className="relative flex items-center">
                  <select
                    name="grade"
                    className={`${inputBase} ${focusStyle} appearance-none flex-1`}
                    value={formData.grade}
                    onChange={handleChange}
                  >
                    <option value="">{t("selectGrade")}</option>
                    <option value="excellent">{t("excellent")}</option>
                    <option value="veryGood">{t("veryGood")}</option>
                    <option value="good">{t("good")}</option>
                  </select>
                  <FiChevronDown
                    size={18}
                    className={`absolute text-[#B38E19] pointer-events-none ${
                      isArabic ? "left-4" : "right-4"
                    }`}
                  />
                </div>
              </div>

              {/* Graduation Date */}
              <div className="relative">
                <label className="block mb-2 text-lg font-medium">{t("graduationDate")}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.graduationDate}
                    placeholder={t("graduationDate")}
                    readOnly
                    className={`${inputBase} ${focusStyle}`}
                    onFocus={openDatePicker}
                  />
                  <FiCalendar
                    role="button"
                    onClick={openDatePicker}
                    size={18}
                    className={`absolute top-1/2 transform -translate-y-1/2 cursor-pointer text-[#B38E19] ${
                      isArabic ? "left-4" : "right-4"
                    }`}
                  />
                  <input
                    type="date"
                    ref={graduationDateRef}
                    className="absolute opacity-0 pointer-events-none"
                    onChange={(e) =>
                      setFormData({ ...formData, graduationDate: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* College */}
              <div>
                <label className="block mb-2 text-lg font-medium">{t("college")}</label>
                <input
                  type="text"
                  name="college"
                  placeholder={t("collegePlaceholder")}
                  className={`${inputBase} ${focusStyle}`}
                  value={formData.college}
                  onChange={handleChange}
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
            <button
              className={`bg-[#b38e19] text-white w-full sm:w-24 h-10 rounded-md cursor-pointer font-${
                isArabic ? "cairo" : "roboto"
              } text-sm`}
            >
              {t("save")}
            </button>
            <button
              className={`bg-gray-300 text-black w-full sm:w-24 h-10 rounded-md cursor-pointer font-${
                isArabic ? "cairo" : "roboto"
              } text-sm`}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
