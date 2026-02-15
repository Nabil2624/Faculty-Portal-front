import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const { i18n } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const isArabic = i18n.language === "ar";

  // نستخدم clamp للـ margin
  const sidebarMargin = isExpanded
    ? "clamp(14rem, 14.5vw, 30.5rem)"
    : "clamp(2.7rem, 4vw, 8.5rem)"; 

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
        className={`flex flex-col flex-1 bg-white transition-all duration-300 4xl:${isArabic? "ml-[100rem]" : "mr-80"}`}
        style={{
          marginLeft: !isArabic ? sidebarMargin : undefined,
          marginRight: isArabic ? sidebarMargin : undefined,
        }}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 px-3 pt-2 shadow-sm">
          <Header />
        </div>

        {/* Page content (scroll here only) */}
        <div className="flex-1 p-3 bg-white rounded-lg">{children}</div>
      </div>
    </div>
  );
}
