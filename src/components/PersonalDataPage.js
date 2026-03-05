import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import subPicture from "../assets/profileImage.png";
import axiosInstance from "../utils/axiosInstance";

export default function PersonalDataPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("PersonalData");
  const isArabic = i18n.language === "ar";

  const [personalData, setPersonalData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPersonalData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        "/FacultyMemberData/PersonalData",
        {
          skipGlobalErrorHandler: true,
        },
      );
      setPersonalData(response.data || {});
    } catch (err) {
      console.error("Failed to fetch personal data:", err);
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

  const infoList = [
    { label: t("name"), value: getValue(personalData?.name) },
    {
      label: t("nationalNumber"),
      value: getValue(personalData?.nationalNumber),
    },
    { label: t("title"), value: getValue(personalData?.title) },
    { label: t("gender"), value: getValue(personalData?.gender) },
    { label: t("maritalStatus"), value: getValue(personalData?.maritalStatus) },
    { label: t("university"), value: getValue(personalData?.university) },
    { label: t("department"), value: getValue(personalData?.department) },
    { label: t("authority"), value: getValue(personalData?.authority) },
    { label: t("field"), value: getValue(personalData?.field) },
    {
      label: t("generalSpecialization"),
      value: getValue(personalData?.generalSpecialization),
    },
    {
      label: t("exactSpecialization"),
      value: getValue(personalData?.accurateSpecialization),
    },
    { label: t("birthDate"), value: getValue(personalData?.birthDate) },
    { label: t("birthPlace"), value: getValue(personalData?.birthPlace) },
    {
      label: t("nameInComposition"),
      value: getValue(personalData?.nameInComposition),
    },
  ];

  return (
    <Layout>
      <div className={`${isArabic ? "rtl" : "ltr"} p-4`}>
        {/* العنوان */}
        <h2 className="text-3xl font-bold mb-6 text-start relative">
          {t("personalData")}
          <span className="block w-16 h-1 bg-[#b38e19] mt-2 "></span>
        </h2>

        {/* البلوك الرئيسي */}
        <div className="bg-white rounded-lg shadow w-full  p-6 flex flex-col md:flex-row gap-8 mx-auto">
          {/* Profile Section */}
          <div className="flex flex-col items-center">
            <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-[#b38e19]">
              <img
                src={subPicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* الاسم فقط بدون اللقب */}
            <h6 className="font-bold mt-4 text-center">
            {getValue(personalData?.title)} {" "} {getValue(personalData?.name)}
            </h6>

            {/* زرار Edit */}
            <button
              onClick={() => navigate("/editpersonal", { state: personalData })}
              className="mt-6 bg-[#b38e19] text-white px-6 py-2 rounded-md"
            >
              {t("edit")}
            </button>
          </div>

          {/* Data Grid Section */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {infoList.map((item, index) => (
                <div key={index} className="flex flex-col">
                  <label className="mb-1 font-semibold">{item.label}:</label>
                  <div className="border rounded px-2 py-1 bg-gray-50 min-h-[38px] flex items-center">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Composition Topics */}
            <div className="mt-4">
              <label className="mb-1 font-semibold">
                {t("compositionTopicTitle")}:
              </label>
              <div className="border rounded px-2 py-2 bg-gray-50 h-[120px] overflow-y-auto whitespace-pre-wrap">
                {personalData?.compositionTopics || t("none")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
