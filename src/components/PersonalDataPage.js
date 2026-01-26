import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import subPicture from "../assets/profileImage.png";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";

export default function PersonalDataPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("PersonalData");
  const isArabic = i18n.language === "ar";

  const [personalData, setPersonalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPersonalData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        "/FacultyMemberData/PersonalData",
        { skipGlobalErrorHandler: true }
      );

      setPersonalData(response.data || {});
    } catch (err) {
      console.error("Failed to fetch personal data:", err);

      if (err.response?.status === 404) {
        setPersonalData({});
      } else {
        setPersonalData({});
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonalData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const getValue = (obj) => {
    if (!obj || obj === "") return t("none");
    if (typeof obj === "string") return obj || t("none");
    return isArabic ? obj.valueAr || t("none") : obj.valueEn || t("none");
  };

  const infoList = [
    { label: t("name"), value: getValue(personalData?.name) },
    { label: t("nationalNumber"), value: getValue(personalData?.nationalNumber) },
    { label: t("title"), value: getValue(personalData?.title) },
    { label: t("gender"), value: getValue(personalData?.gender) },
    { label: t("maritalStatus"), value: getValue(personalData?.maritalStatus) },
    { label: t("university"), value: getValue(personalData?.university) },
    { label: t("department"), value: getValue(personalData?.department) },
    { label: t("authority"), value: getValue(personalData?.authority) },
    { label: t("field"), value: getValue(personalData?.field) },
    { label: t("generalSpecialization"), value: getValue(personalData?.generalSpecialization) },
    { label: t("exactSpecialization"), value: getValue(personalData?.accurateSpecialization) },
    { label: t("birthDate"), value: getValue(personalData?.birthDate) },
    { label: t("birthPlace"), value: getValue(personalData?.birthPlace) },
    { label: t("nameInComposition"), value: getValue(personalData?.nameInComposition) },
  ];

  return (
    <Layout>
      <div className={`${isArabic ? "rtl" : "ltr"} p-5 flex flex-col`}>
        <h2 className="text-3xl font-bold inline-block relative text-start mb-[80px]">
          {t("personalData")}
          <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
        </h2>

        {error && (
          <div className="text-red-500 text-center mb-5 text-lg">
            {error}
          </div>
        )}

        <div className="flex flex-wrap justify-center flex-row-reverse gap-x-32">
          {/* Profile */}
          <div className="flex flex-col items-center">
            <div className="w-[200px] h-[280px] rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={subPicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <button
              onClick={() => navigate("/editpersonal", { state: personalData })}
              className="bg-[#b38e19] text-white px-4 py-2 rounded-md lg:px-20 lg:py-1 mt-[183px]"
            >
              {t("edit")}
            </button>
          </div>

          {/* Info Grid */}
          <div className="flex-1 min-w-[200px] max-w-[1050px] flex flex-col gap-10">
            <div className="grid grid-cols-3 gap-5">
              {infoList.map((item, index) => (
                <div
                  key={index}
                  className="flex h-[40px] rounded-md overflow-hidden text-sm"
                >
                  <div className="bg-[#19355a] text-white w-32 flex items-center justify-center px-2 text-center">
                    {item.label}
                  </div>

                  <div className="bg-gray-200 text-black w-full flex-1 flex items-center justify-center px-2 text-center">
                    {item.value === "" || item.value === null
                      ? t("none")
                      : item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* ------------------------------------------------------ */}
            {/*  COMPOSITION SECTION   */}
            {/* ------------------------------------------------------ */}
            <div className="w-full">
              <div className="max-w-[690px]">
                <h3 className="text-xl font-bold mb-2">
                  {t("compositionTopicTitle")}
                </h3>

                <div
                  className="
                    bg-gray-200 text-black rounded-[12px]
                    border border-[#19355a]
                    w-full h-[120px] p-4
                    overflow-y-auto break-words whitespace-pre-wrap
                  "
                >
                  {personalData?.compositionTopics
                    ? personalData.compositionTopics
                    : t("none")}
                </div>
              </div>
            </div>
            {/* ------------------------------------------------------ */}
          </div>
        </div>
      </div>
    </Layout>
  );
}
