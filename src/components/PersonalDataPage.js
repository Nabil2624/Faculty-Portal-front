// pages/PersonalDataPage.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import subPicture from "../images/profileImage.png";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";

export default function PersonalDataPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("personaldata");
  const isArabic = i18n.language === "ar";

  const [personalData, setPersonalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonalData = async () => {
      setLoading(true);
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get("/PersonalData", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPersonalData(response.data.data || response.data);
      } catch (err) {
        console.error("Failed to fetch personal data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const infoList = [
    { label: t("title"), value: personalData?.title },
    { label: t("university"), value: personalData?.universityName },
    { label: t("birthDate"), value: personalData?.birthDate },
    { label: t("name"), value: personalData?.name },
    { label: t("department"), value: personalData?.departmentName },
    { label: t("faculty"), value: personalData?.facultyName },
    { label: t("ssn"), value: personalData?.ssn?.trim() },
    {
      label: t("generalSpecialization"),
      value: personalData?.generalSpecialization,
    },
    { label: t("field"), value: personalData?.fieldOfStudy },
    { label: t("gender"), value: personalData?.gender },
    { label: t("nameInComposition"), value: personalData?.nameInComposition },
    {
      label: t("exactSpecialization"),
      value: personalData?.accurateSpecialization,
    },
    { label: t("birthPlace"), value: personalData?.birthPlace },
    { label: t("maritalStatus"), value: personalData?.socialStatus },
  ];

  return (
    <Layout>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6 flex flex-col`}>
        {/* Page title */}
        <h2 className="text-3xl font-bold inline-block relative text-start mb-[80px]">
          {t("personalData")}
          <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
        </h2>

        {/* Main content */}
        <div className="flex flex-wrap justify-center flex-row-reverse gap-x-20">
          {/* Profile photo + buttons */}
          <div className="flex flex-col items-center gap-[100px]">
            <div className="w-[200px] h-[280px] rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={subPicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div
            className={`flex flex-col sm:flex-row gap-3 mt-6 sm:mt-10 justify-end max-w-6xl absolute ${
              isArabic ? "left-[53px]" : "right-[53px]"
            } bottom-[28px]`}
          >
            <button
              onClick={() => navigate("/editpersonal")}
              className={`bg-[#b38e19] text-white w-24 h-10 rounded-md cursor-pointer font-${
                isArabic ? "cairo" : "roboto"
              } text-sm`}
            >
              {t("edit")}
            </button>
            <button
              onClick={() => navigate(-1)}
              className={`bg-gray-300 text-black w-24 h-10 rounded-md cursor-pointer font-${
                isArabic ? "cairo" : "roboto"
              } text-sm`}
            >
              {t("back")}
            </button>
          </div>

          {/* Personal info grid */}
          <div
            className={`flex-1 min-w-[200px] max-w-[1050px] flex flex-col gap-4 `}
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
                  <div className="bg-gray-200 text-black flex-1 flex items-center justify-center px-2 text-center">
                    {item.value || t("none")}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Composition Topic Section */}
          <div className={`w-full mt-10 ${isArabic ? "mr-10" : "ml-10"}`}>
            <div className="max-w-[690px]">
              {" "}
              {/* نفس عرض الشبكة */}
              <h3 className="text-xl font-bold mb-3">
                {t("compositionTopicTitle")}
              </h3>
              <div
                className="bg-gray-200 text-black w-full h-[120px] rounded-md p-4 
            overflow-y-auto break-words whitespace-pre-wrap"
              >
                {personalData?.compositionTopic || t("none")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
