// src/pages/EditConference.jsx
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { FiCalendar, FiChevronDown } from "react-icons/fi";
import { Info } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function EditConference() {
  const { t, i18n } = useTranslation("add-conference");
  const isArabic = i18n.language === "ar";
  const location = useLocation();
  const existingData = location.state?.existingData || null;
  const navigate = useNavigate();
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    type: "",
    localOrInternational: "",
    conferenceName: "",
    participationRole: "",
    organizingBody: "",
    website: "",
    country: "",
    city: "",
    description: "",
    attachments: null,
    startDate: "",
    endDate: "",
  });

  // Pre-fill form with existing data
  useEffect(() => {
    if (existingData) {
      setFormData({
        type: existingData.type || "",
        localOrInternational: existingData.localOrInternational || "",
        conferenceName: existingData.conferenceName || "",
        participationRole: existingData.participationRole || "",
        organizingBody: existingData.organizer || "",
        website: existingData.website || "",
        country: existingData.country || "",
        city: existingData.city || "",
        description: existingData.description || "",
        attachments: existingData.attachments || null,
        startDate: existingData.startDate || "",
        endDate: existingData.endDate || "",
      });
    }
  }, [existingData]);

  const openDatePicker = (ref) => {
    if (ref.current && typeof ref.current.showPicker === "function") {
      ref.current.showPicker();
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
    console.log("Edited data:", formData);
    // Call your API to update the conference here
  };

  const inputBase =
    "w-full border border-gray-300 rounded-md px-4 py-2 placeholder-gray-400 bg-[#E2E2E2] outline-none transition-all duration-150 ease-linear text-[12px]";
  const focusStyle =
    "focus:border-gray-300 focus:shadow-[0_0_0_4px_rgba(179,142,25,0.5)]";

  return (
    <Layout>
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="p-4 sm:p-6 bg-white min-h-screen"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-12 inline-block w-full max-w-6xl">
          {t("editConference")}
          <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
        </h2>

        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 lg:gap-x-36 gap-y-6 w-full max-w-6xl"
          >
            {/* RIGHT Column */}
            <div className="space-y-6">
              {/* Type + Local/International */}
              <div className="flex gap-8">
                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("type")}
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="type"
                        value="seminar"
                        checked={formData.type === "seminar"}
                        onChange={handleChange}
                      />
                      {t("seminar")}
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="type"
                        value="conference"
                        checked={formData.type === "conference"}
                        onChange={handleChange}
                      />
                      {t("conference")}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("localOrInternational")}
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="localOrInternational"
                        value="local"
                        checked={formData.localOrInternational === "local"}
                        onChange={handleChange}
                      />
                      {t("local")}
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="localOrInternational"
                        value="international"
                        checked={
                          formData.localOrInternational === "international"
                        }
                        onChange={handleChange}
                      />
                      {t("international")}
                    </label>
                  </div>
                </div>
              </div>

              {/* Conference Name */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("conferenceName")} <span className="text-[#b38e19]">*</span>
                </label>
                <input
                  type="text"
                  name="conferenceName"
                  placeholder={t("conferenceNamePlaceholder")}
                  className={`${inputBase} ${focusStyle}`}
                  value={formData.conferenceName}
                  onChange={handleChange}
                />
              </div>

              {/* Participation Role */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("participationRole")} <span className="text-[#b38e19]">*</span>
                </label>
                <div className="relative flex items-center">
                  <select
                    name="participationRole"
                    className={`${inputBase} ${focusStyle} appearance-none flex-1`}
                    value={formData.participationRole}
                    onChange={handleChange}
                  >
                    <option value="">{t("selectRole")}</option>
                    <option value="speaker">{t("speaker")}</option>
                    <option value="attendee">{t("attendee")}</option>
                  </select>
                  <FiChevronDown
                    size={18}
                    className={`absolute text-[#B38E19] pointer-events-none ${
                      isArabic ? "left-4" : "right-4"
                    }`}
                  />
                </div>
              </div>

              {/* Organizing Body */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("organizingBody")} <span className="text-[#b38e19]">*</span>
                </label>
                <input
                  type="text"
                  name="organizingBody"
                  placeholder={t("organizingBodyPlaceholder")}
                  className={`${inputBase} ${focusStyle}`}
                  value={formData.organizingBody}
                  onChange={handleChange}
                />
              </div>

              {/* Website */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("website")}
                </label>
                <input
                  type="text"
                  name="website"
                  placeholder={t("websitePlaceholder")}
                  className={`${inputBase} ${focusStyle}`}
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* LEFT Column */}
            <div className="space-y-6">
              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("startDate")}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.startDate}
                      placeholder={t("startDate")}
                      readOnly
                      className={`${inputBase} ${focusStyle}`}
                      onFocus={() => openDatePicker(startDateRef)}
                    />
                    <FiCalendar
                      role="button"
                      onClick={() => openDatePicker(startDateRef)}
                      size={18}
                      className={`absolute top-1/2 transform -translate-y-1/2 cursor-pointer text-[#B38E19] ${
                        isArabic ? "left-4" : "right-4"
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
                </div>

                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("endDate")}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.endDate}
                      placeholder={t("endDate")}
                      readOnly
                      className={`${inputBase} ${focusStyle}`}
                      onFocus={() => openDatePicker(endDateRef)}
                    />
                    <FiCalendar
                      role="button"
                      onClick={() => openDatePicker(endDateRef)}
                      size={18}
                      className={`absolute top-1/2 transform -translate-y-1/2 cursor-pointer text-[#B38E19] ${
                        isArabic ? "left-4" : "right-4"
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
                </div>
              </div>

              {/* Country + City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("country")}
                  </label>
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

                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("city")}
                  </label>
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

              {/* Description */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("description")}
                </label>
                <textarea
                  name="description"
                  placeholder={t("descriptionPlaceholder")}
                  className={`${inputBase} ${focusStyle} h-32 resize-none`}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              {/* Attachments */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("attachments")}
                </label>
                <div className="flex items-start gap-2 mb-2">
                  <Info size={17} className="text-gray-600 mt-1" />
                  <p className="text-yellow-600 text-sm">
                    {t("attachmentsHint")}
                  </p>
                </div>

                <input
                  type="file"
                  name="attachments"
                  accept=".pdf,.jpg,.png"
                  ref={fileInputRef}
                  onChange={handleChange}
                  className="hidden"
                />

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current && fileInputRef.current.click()
                    }
                    className="bg-[#19355A] text-white px-9 py-1 rounded-md hover:bg-[#162d4a] transition-colors"
                  >
                    {t("chooseFile")}
                  </button>

                  {formData.attachments && (
                    <span className="text-sm text-gray-700 truncate max-w-[200px]">
                      {formData.attachments.name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ✅ Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-3 mt-6 sm:mt-10 justify-end max-w-6xl absolute ${
                isArabic ? "left-[53px]" : "right-[53px]"
              } bottom-[28px]`}
            >
              {/* Save Button */}
              <button
                type="submit"
                onClick={() => navigate("/seminars-and-conferences")}
                className={`bg-[#b38e19] text-white sm:w-24 h-10 rounded-md cursor-pointer font-${
                  isArabic ? "cairo" : "roboto"
                } text-sm`}
              >
                {t("save")}
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => navigate("/seminars-and-conferences")}
                className={`bg-gray-300 text-black sm:w-24 h-10 rounded-md cursor-pointer font-${
                  isArabic ? "cairo" : "roboto"
                } text-sm`}
              >
                {t("cancel")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
