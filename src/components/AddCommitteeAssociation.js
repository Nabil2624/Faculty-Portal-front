import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { FiCalendar } from "react-icons/fi";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddCommitteeAssociation() {
  const { t, i18n } = useTranslation("add-committee");
  const isArabic = i18n.language === "ar";
  const dir = i18n.dir();
  const navigate = useNavigate();

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [typeValue, setTypeValue] = useState("");
  const [degreeValue, setDegreeValue] = useState("");

  const inputBase =
    "w-full border border-gray-300 rounded-md px-4 py-2 placeholder-gray-400 bg-[#E2E2E2] outline-none transition-all duration-150 ease-linear text-[12px]";
  const focusStyle =
    "focus:border-gray-300 focus:shadow-[0_0_0_4px_rgba(179,142,25,0.5)]";

  const selectClass =
    "w-full bg-[#E2E2E2] border border-gray-300 rounded-md py-2 px-3 text-sm text-gray-800 appearance-none outline-none transition-all";

  const openPicker = (ref) => {
    if (!ref.current) return;
    try {
      ref.current.showPicker();
    } catch (_) {
      ref.current.focus();
    }
  };

  return (
    <Layout>
      <div
        dir={dir}
        className="p-4 sm:p-6 flex flex-col bg-white min-h-screen"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-12 inline-block relative text-start">
          {t("addCommittee.title")}
          <span className="block w-16 h-1 bg-[#b38e19] mt-1" />
        </h2>

        <div className="flex flex-col items-center">
          <form className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 lg:gap-x-36 gap-y-6 w-full max-w-6xl">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* Committee/Association */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.committee")}{" "}
                  <span className="text-[#b38e19]">*</span>
                </label>
                <input
                  type="text"
                  placeholder={t("placeholders.committee")}
                  className={`${inputBase} ${focusStyle}`}
                />
              </div>

              {/* Type of Committee/Association (DROPDOWN) */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.type")}{" "}
                  <span className="text-[#b38e19]">*</span>
                </label>

                <div className="relative">
                  <select
                    className={`${selectClass} ${focusStyle}`}
                    value={typeValue}
                    onChange={(e) => setTypeValue(e.target.value)}
                  >
                    <option value="">{t("placeholders.type")}</option>
                    <option value="local">{t("types.local")}</option>
                    <option value="international">{t("types.international")}</option>
                  </select>

                  <ChevronDown
                    size={18}
                    className="absolute top-3 text-[#B38E19] pointer-events-none"
                    style={isArabic ? { left: "12px" } : { right: "12px" }}
                  />
                </div>
              </div>

              {/* Membership Degree (DROPDOWN) */}
              <div>
                  {t("fields.degree")}{" "}
                  <span className="text-[#B38E19]">*</span>
                <label className="block mb-2 text-lg font-medium">
                </label>

                <div className="relative">
                  <select
                    className={`${selectClass} ${focusStyle}`}
                    value={degreeValue}
                    onChange={(e) => setDegreeValue(e.target.value)}
                  >
                    <option value="">{t("placeholders.degree")}</option>
                    <option value="member">{t("degrees.member")}</option>
                    <option value="active">{t("degrees.active")}</option>
                    <option value="honor">{t("degrees.honor")}</option>
                  </select>

                  <ChevronDown
                    size={18}
                    className="absolute top-3 text-[#B38E19] pointer-events-none"
                    style={isArabic ? { left: "12px" } : { right: "12px" }}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* DATE ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="relative">
                  <label className="block mb-2 text-lg font-medium">
                    {t("fields.startDate")}{" "}
                    <span className="text-[#b38e19]">*</span>
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={startDate}
                      className={`${inputBase} ${focusStyle}`}
                      placeholder={t("placeholders.startDate")}
                      onClick={() => openPicker(startDateRef)}
                    />

                    <FiCalendar
                      size={18}
                      className="absolute top-1/2 -translate-y-1/2 text-[#B38E19] cursor-pointer"
                      style={isArabic ? { left: "10px" } : { right: "10px" }}
                      onClick={() => openPicker(startDateRef)}
                    />

                    <input
                      type="date"
                      ref={startDateRef}
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
                      readOnly
                      value={endDate}
                      className={`${inputBase} ${focusStyle}`}
                      placeholder={t("placeholders.endDate")}
                      onClick={() => openPicker(endDateRef)}
                    />

                    <FiCalendar
                      size={18}
                      className="absolute top-1/2 -translate-y-1/2 text-[#B38E19] cursor-pointer"
                      style={isArabic ? { left: "10px" } : { right: "10px" }}
                      onClick={() => openPicker(endDateRef)}
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

              {/* DESCRIPTION */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.description")}
                </label>
                <textarea
                  rows="6"
                  className={`${inputBase} ${focusStyle} resize-none`}
                  placeholder={t("placeholders.description")}
                />
              </div>
            </div>
          </form>

          {/* BUTTONS */}
          <div
            className={`flex flex-col sm:flex-row gap-3 mt-10 justify-end max-w-6xl absolute ${
              isArabic ? "left-[53px]" : "right-[53px]"
            } bottom-[28px]`}
          >
            <button
              type="button"
              onClick={() => navigate("/committees-associations")}
              className={`bg-[#b38e19] text-white sm:w-24 h-10 rounded-md cursor-pointer font-${
                isArabic ? "cairo" : "roboto"
              } text-sm`}
            >
              {t("buttons.save")}
            </button>

            <button
              type="button"
              onClick={() => navigate("/committees-associations")}
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
