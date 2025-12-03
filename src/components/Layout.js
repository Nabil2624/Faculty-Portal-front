import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const { i18n } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const isArabic = i18n.language === "ar";

  return (
    <div className={`flex h-screen w-full ${isArabic ? "rtl" : "ltr"}`}>
      {/* Sidebar */}
      <Sidebar
        lang={i18n.language}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />

      {/* MAIN */}
      <div
        className={`flex flex-col flex-1 bg-white transition-all duration-300
          ${
            isExpanded
              ? isArabic
                ? "mr-56"
                : "ml-56"
              : isArabic
              ? "mr-14"
              : "ml-14"
          }
        `}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 px-3 pt-2 shadow-sm">
          <Header />
        </div>

        {/* Page content (scroll here only) */}
        <div className="flex-1 p-3 bg-white rounded-lg ">{children}</div>
      </div>
    </div>
  );
}
