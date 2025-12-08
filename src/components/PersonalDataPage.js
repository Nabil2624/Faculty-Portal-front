import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import subPicture from "../images/profileImage.png";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";

export default function PersonalDataPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("PersonalData");
  const isArabic = i18n.language === "ar";

  const [personalData, setPersonalData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch personal data
  useEffect(() => {
    const fetchPersonalData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        const response = await axiosInstance.get(
          "/FacultyMemberData/PersonalData",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setPersonalData(response.data);
      } catch (err) {
        console.error("Failed to fetch personal data:", err);

        if (err.response && err.response.status === 404) {
          setPersonalData({});
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const getValue = (obj) => {
    if (!obj) return t("none");
    if (typeof obj === "string") return obj;
    return isArabic ? obj.valueAr : obj.valueEn;
  };

  const infoList = [
    { label: t("name"), value: personalData?.name },
    { label: t("nationalNumber"), value: personalData?.nationalNumber },
    { label: t("title"), value: getValue(personalData?.title) },
    { label: t("gender"), value: getValue(personalData?.gender) },
    { label: t("maritalStatus"), value: getValue(personalData?.maritalStatus) },
    { label: t("university"), value: getValue(personalData?.university) },
    { label: t("department"), value: getValue(personalData?.department) },
    { label: t("authority"), value: getValue(personalData?.authority) },
    { label: t("field"), value: getValue(personalData?.field) },
    {
      label: t("generalSpecialization"),
      value: personalData?.generalSpecialization,
    },
    {
      label: t("exactSpecialization"),
      value: personalData?.accurateSpecialization,
    },
    { label: t("birthDate"), value: personalData?.birthDate },
    { label: t("birthPlace"), value: personalData?.birthPlace },
    { label: t("nameInComposition"), value: personalData?.nameInComposition },
  ];

  return (
    <Layout>
      <div className={`${isArabic ? "rtl" : "ltr"} p-5 flex flex-col `}>
        <h2 className="text-3xl font-bold inline-block relative text-start mb-[80px]">
          {t("personalData")}
          <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
        </h2>

        <div className="flex flex-wrap justify-center flex-row-reverse gap-x-32">
          {/* Profile */}
          <div className="flex flex-col items-center ">
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
          <div
            className={`flex-1 min-w-[200px] max-w-[1050px] flex flex-col gap-4`}
          >
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
                    {item.value || t("none")}
                  </div>
                </div>
              ))}
            </div>

            {/* Composition Topics */}
            <div className={`w-full mt-10 `}>
              <div className="max-w-[690px]">
                <h3 className="text-xl font-bold mb-3">
                  {t("compositionTopicTitle")}
                </h3>
                <div className="bg-gray-200 text-black rounded-[12px] border border-[#19355a] w-full h-[120px] p-4 overflow-y-auto break-words whitespace-pre-wrap">
                  {personalData?.compositionTopics || t("none")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
