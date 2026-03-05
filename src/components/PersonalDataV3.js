import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import subPicture from "../assets/profileImage.png";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "./LoadingSpinner";

export default function PersonalDataV3() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("PersonalData");
  const isArabic = i18n.language === "ar";

  const [personalData, setPersonalData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchPersonalData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        "/FacultyMemberData/PersonalData",
        { skipGlobalErrorHandler: true }
      );
      setPersonalData(response.data || {});
    } catch (err) {
      console.error(err);
      setPersonalData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonalData();
  }, []);

  const getValue = (obj) => {
    if (!obj || obj === "") return t("none");
    if (typeof obj === "string") return obj || t("none");
    return isArabic ? obj.valueAr || t("none") : obj.valueEn || t("none");
  };

  const personalInfo = [
    { label: t("name"), value: getValue(personalData?.name) },
    { label: t("nationalNumber"), value: getValue(personalData?.nationalNumber) },
    { label: t("gender"), value: getValue(personalData?.gender) },
    { label: t("maritalStatus"), value: getValue(personalData?.maritalStatus) },
    { label: t("birthDate"), value: getValue(personalData?.birthDate) },
    { label: t("birthPlace"), value: getValue(personalData?.birthPlace) },
  ];

  const workInfo = [
    { label: t("title"), value: getValue(personalData?.title) },
    { label: t("university"), value: getValue(personalData?.university) },
    { label: t("department"), value: getValue(personalData?.department) },
    { label: t("authority"), value: getValue(personalData?.authority) },
    { label: t("field"), value: getValue(personalData?.field) },
    { label: t("generalSpecialization"), value: getValue(personalData?.generalSpecialization) },
    { label: t("exactSpecialization"), value: getValue(personalData?.accurateSpecialization) },
  ];

  if (loading) return <LoadingSpinner />;

  // نعمل صفوف مدموجة: كل صف = personal + work
  const maxLength = Math.max(personalInfo.length, workInfo.length);
  const rows = Array.from({ length: maxLength }, (_, i) => ({
    personal: personalInfo[i] || { label: "", value: "" },
    work: workInfo[i] || { label: "", value: "" },
  }));

  return (
    <Layout>
      <div className={`${isArabic ? "rtl" : "ltr"} p-2`}>
        {/* Title */}
        <h2 className="text-3xl font-semibold mb-6 text-start">
          {t("personalData")}
          <span className="block w-16 h-1 bg-[#b38e19] mt-2"></span>
        </h2>

        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col lg:flex-row gap-8">
          {/* Profile */}
          <div className="flex flex-col items-center min-w-[220px]">
            <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-[#b38e19]">
              <img
                src={subPicture}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>

            <h6 className="font-bold mt-4 text-center text-lg">
              {getValue(personalData?.title)} {getValue(personalData?.name)}
            </h6>

            <button
              onClick={() => navigate("/editpersonal", { state: personalData })}
              className="mt-6 bg-[#b38e19] text-white px-6 py-2 rounded-md hover:opacity-90"
            >
              {t("edit")}
            </button>
          </div>

          {/* Combined Table 4 columns */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg overflow-hidden border"
            >
              {rows.map((row, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-4 ${
                    i % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <div className="px-4 py-3 font-semibold bg-gray-200">{row.personal.label}</div>
                  <div className="px-4 py-3">{row.personal.value}</div>
                  <div className="px-4 py-3 font-semibold bg-gray-200">{row.work.label}</div>
                  <div className="px-4 py-3">{row.work.value}</div>
                </div>
              ))}
            </motion.div>

            {/* Composition */}
            <div className="mt-6">
              <label className="font-semibold block mb-2">
                {t("compositionTopicTitle")}
              </label>
              <div className="border rounded-md bg-gray-50 p-3 min-h-[120px] whitespace-pre-wrap">
                {personalData?.compositionTopics || t("none")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}