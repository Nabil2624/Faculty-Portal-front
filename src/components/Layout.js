import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function Layout({ children }) {
  const { i18n } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const isArabic = i18n.language === "ar";


  const sidebarMargin = isExpanded
    ? "clamp(14rem, 14.5vw, 30.5rem)"
    : "clamp(2.7rem, 4vw, 8.5rem)";

  return (
    <div 
      id="main-scroll" 
      className={`flex h-screen w-full bg-white ${isArabic ? "rtl" : "ltr"}`}
    >
      {/* 1. Sidebar */}
      <Sidebar
        lang={i18n.language}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />

      {/* 2. Main Content Wrapper */}
      <div
        className="flex flex-col flex-1 h-screen overflow-y-auto transition-all duration-300 ease-in-out relative"
        style={{
          marginLeft: !isArabic ? sidebarMargin : undefined,
          marginRight: isArabic ? sidebarMargin : undefined,
        }}
      >
        {/* 3. Sticky Header Container */}
        <div
          className="fixed top-0 z-50 px-3 pt-2 transition-all duration-300 ease-in-out shadow-sm"
          style={{
            left: !isArabic ? sidebarMargin : 0,
            right: isArabic ? sidebarMargin : 0,
            width: "auto",
          }}
        >
          <Header isExpanded={isExpanded} />
        </div>

        {/* 4. Page Content Area */}
        <div
          className="flex flex-col flex-1 p-3 bg-white"
          style={{
            marginTop: "clamp(60px, 4vw, 140px)", // تعويض ارتفاع الهيدر
          }}
        >
          {/* محتوى الصفحة الفعلي */}
          <div className="w-full flex-1 rounded-lg">
            {children}
          </div>

          {/* 5. Footer */}
          {/* تم استدعاء الكامبونانت هنا ليتحرك (يسكرول) مع الصفحة بسلاسة */}
          <Footer />
        </div>
      </div>
    </div>
  );
}