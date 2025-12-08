import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export default function SocialNetworkingPages() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("socialnetworkingpages");
  const isArabic = i18n.language === "ar";

  const noDataText = isArabic ? "لا يوجد" : "none";

  const [socialData, setSocialData] = useState({
    linkedIn: "",
    instagram: "",
    personalWebsite: "",
    googleScholar: "",
    scopus: "",
    facebook: "",
    x: "",
    youTube: "",
  });

  // ----------------------------------------------------------
  // Extract domain name (instagram.com,facebook.com etc.)
  // ----------------------------------------------------------
  const getDomain = (url) => {
    if (!url) return "";
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url; // fallback if invalid url
    }
  };

  // ----------------------------------------------------------
  // Fetch Data
  // ----------------------------------------------------------
  useEffect(() => {
    const fetchSocial = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axiosInstance.get(
          "/FacultyMemberData/SocialMediaPlatforms",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSocialData(response.data);
      } catch (err) {
        console.error(err);

        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchSocial();
  }, [navigate]);

  // ----------------------------------------------------------
  // Prepare display data
  // ----------------------------------------------------------
  const socialNetworkingPages = [
    { label: t("PersonalWebsite"), key: "personalWebsite" },
    { label: t("Facebook"), key: "facebook" },
    { label: t("Twitter"), key: "x" },
    { label: t("GoogleScholar"), key: "googleScholar" },
    { label: t("LinkedIn"), key: "linkedIn" },
    { label: t("Scopus"), key: "scopus" },
    { label: t("Instagram"), key: "instagram" },
    { label: t("YouTube"), key: "youTube" },
  ];

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------
  return (
    <Layout>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6 flex flex-col w-full box-border`}>

        {/* Page title */}
        <h2
          className={`text-3xl font-bold mb-[90px] inline-block relative text-${isArabic ? "right" : "left"}`}
        >
          {t("socialNetworkingPages")}
          <span
            className={`block w-16 h-1 bg-[#b38e19] mt-1 ${
              isArabic ? "ml-auto" : "mr-auto"
            }`}
          ></span>
        </h2>

        {/* GRID */}
        <div className="flex justify-center items-center w-full" style={{ flexGrow: 0 }}>
          <div className="grid grid-cols-3 gap-7 max-w-[1250px] w-full">

            {socialNetworkingPages.map((item, index) => {
              const url = socialData[item.key];
              const domain = getDomain(url);

              const display =
                domain && domain.trim() !== "" ? domain : noDataText;

              return (
                <div
                  key={index}
                  className="flex h-[40px] rounded-md overflow-hidden text-sm"
                >
                  <div className="bg-[#19355a] text-white w-[120px] flex items-center justify-center text-center px-2">
                    {item.label}
                  </div>

                  <div
                    className="bg-gray-200 text-black flex-1 flex items-center text-center justify-center px-2"
                    onClick={() => {
                      if (url) window.open(url, "_blank");
                    }}
                  >
                    {display}
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* Buttons */}
        <div
          className={`flex gap-3 absolute ${
            isArabic ? "left-[53px]" : "right-[53px]"
          } bottom-[28px]`}
        >
          <button
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

      </div>
    </Layout>
  );
}
