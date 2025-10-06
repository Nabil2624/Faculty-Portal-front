import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const { i18n } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  const isArabic = i18n.language === "ar";

  return (
    <div className={`flex h-screen w-full ${isArabic ? "rtl" : "ltr"}`}>
      {/* Sidebar with smooth width transition */}
      <div
        className={`transition-all duration-300 ease-in-out`}
      >
        <Sidebar
          lang={i18n.language}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
      </div>

      {/* Main content with smooth margin transition */}
      <div
        className={`flex flex-col flex-1 bg-white transition-all duration-300 ease-in-out
          ${isExpanded ? (isArabic ? "mr-56" : "ml-56") : (isArabic ? "mr-14" : "ml-14")}
        `}
      >
        {/* Header */}
        <div className="bg-white-600 text-white p-3 transition-all duration-300 ease-in-out">
          <Header onLanguageChange={handleLanguageChange} />
        </div>

        {/* Page content */}
        <div className="flex-1 p-4 bg-white rounded-lg transition-all duration-300 ease-in-out">
          {children}
        </div>
      </div>
    </div>
  );
}
