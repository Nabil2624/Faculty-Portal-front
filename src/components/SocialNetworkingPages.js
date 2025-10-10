import React from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

export default function SocialNetworkingPages() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("socialNetworkingPages");
  const isArabic = i18n.language === "ar";

  const socialNetworkingPages = [
    { label: t("PersonalWebsite"), value: "لا يوجد" },
    { label: t("Facebook"), value: "/https://www.facebook.com/ahmeday..." },
    { label: t("Twitter"), value: "لا يوجد" },
    { label: t("GoogleScholar"), value: "https://scholar.google.com/citations?.." },  
    { label: t("LinkedIn"), value: "/https://www.linkedin.com/in/ahmeda..." },      
    { label: t("Scopus"), value: "https://www.scopus.com/authid/detail.." },
    { label: t("Instagram"), value: "لا يوجد" },
  ];

  return (
    <Layout>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-6 flex flex-col w-full box-border`}
      >
        {/* Page title */}
        <h2 className={`text-3xl font-bold mb-[90px] inline-block relative text-${isArabic ? "right" : "left"}`}>
          {t("socialNetworkingPages")}
          <span
            className={`block w-16 h-1 bg-[#b38e19] mt-1 ${isArabic ? "ml-auto" : "mr-auto"}`}
          ></span>
        </h2>

        {/* Personal info grid */}
        <div className="flex justify-center items-center w-full" style={{ flexGrow: 0 }}>
          <div className="grid grid-cols-3 gap-7 max-w-[1250px] w-full">
            {socialNetworkingPages.map((item, index) => (
              <div
                key={index}
                className="flex h-[40px] rounded-md overflow-hidden text-sm"
              >
                <div className="bg-[#19355a] text-white w-[120px] flex items-center justify-center text-center px-2">
                  {item.label}
                </div>
                <div className="bg-gray-200 text-black flex-1 flex items-center text-center justify-center px-2">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons at bottom-left (Arabic) or bottom-right (English) */}
        <div
          className={`flex gap-3 absolute ${isArabic ? "left-[53px]" : "right-[53px]"} bottom-[52px]`}
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
