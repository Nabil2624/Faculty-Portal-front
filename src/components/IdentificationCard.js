import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";

// ------------------------------------------------------
// Extract domain from URL
// ------------------------------------------------------
const getDomain = (value) => {
  if (!value) return "";

  try {
    return new URL(value).hostname.replace("www.", "");
  } catch {
    return value;
  }
};

// ------------------------------------------------------
// Check if value is clickable URL
// ------------------------------------------------------
const isURL = (value) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export default function IdentificationCard() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("identification");
  const isArabic = i18n.language === "ar";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const noDataText = isArabic ? "لا يوجد" : "none";

  // ------------------------------------------------------
  // FETCH DATA
  // ------------------------------------------------------
  const fetchIdentification = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        "/FacultyMemberData/IdentificationCard",
        { skipGlobalErrorHandler: true }
      );

      setData(response.data || {});
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        navigate("/login");
      }

      setData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdentification();
  }, []);

  // ------------------------------------------------------
  // Loading
  // ------------------------------------------------------
  if (loading || data === null) {
    return <LoadingSpinner />;
  }

  // ------------------------------------------------------
  // Convert data to grid
  // EMAIL REMOVED HERE
  // ------------------------------------------------------
  const identificationCard = [
     { label: t("ORCID-ID"), value: data?.orcid },
    { label: t("ResearchGateProfile"), value: data?.researcherGate },
    { label: t("Academia.Eduprofile"), value: data?.academiaEdu },
   
    { label: t("ResearcherID"), value: data?.researcherId },
    { label: t("EBK"), value: data?.ekb }
  ];

  // ------------------------------------------------------
  // Render value
  // ------------------------------------------------------
  const renderValue = (value) => {
    if (!value || value.trim() === "") {
      return noDataText;
    }

    if (isURL(value)) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="no-underline text-black hover:text-black"
        >
          {getDomain(value)}
        </a>
      );
    }

    return value;
  };

  return (
    <Layout>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6 flex flex-col w-full box-border`}>

        {/* Title */}
        <h2
          className={`text-3xl font-bold mb-[90px] inline-block relative text-${isArabic ? "right" : "left"}`}
        >
          {t("IdentificationCard")}
          <span
            className={`block w-16 h-1 bg-[#b38e19] mt-1 ${isArabic ? "ml-auto" : "mr-auto"}`}
          ></span>
        </h2>

        {/* Grid */}
        <div className="flex justify-center items-center w-full" style={{ flexGrow: 0 }}>
          <div className="grid grid-cols-3 gap-7 max-w-[1250px] w-full">

            {identificationCard.map((item, index) => (
              <div
                key={index}
                className="flex h-[40px] rounded-md overflow-hidden text-sm"
              >
                <div className="bg-[#19355a] text-white w-[150px] flex items-center text-center justify-center px-2">
                  {item.label}
                </div>

                <div className="bg-gray-200 text-black flex-1 flex items-center text-center justify-center px-2">
                  {renderValue(item.value)}
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* Buttons */}
        <div
          className={`flex gap-3 absolute ${
            isArabic ? "left-[53px]" : "right-[53px]"
          } bottom-[28px]`}
        >
          <button
            onClick={() => navigate("/edit-identification-card")}
            className="bg-[#b38e19] text-white w-24 h-10 rounded-md cursor-pointer text-sm"
          >
            {t("edit")}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 text-black w-24 h-10 rounded-md cursor-pointer text-sm"
          >
            {t("back")}
          </button>
        </div>

      </div>
    </Layout>
  );
}
