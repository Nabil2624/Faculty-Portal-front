import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import LargeHeader from "./LargeHeader";
import LargeSidebar from "./LargeSidebar";

export default function LargeLayout({ children }) {
  const { i18n } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false); // Sidebar يكون موسع افتراضيًا للشاشات الكبيرة

  const isArabic = i18n.language === "ar";

  // Sidebar width mapping
  const sidebarWidths = {
    collapsed: "w-20 md:w-24 xl:w-28 3xl:w-32",
    expanded: "w-72 md:w-80 xl:w-96 3xl:w-[420px]",
  };

  const currentSidebarWidth = isExpanded
    ? sidebarWidths.expanded
    : sidebarWidths.collapsed;

  return (
    <div className={`flex h-screen w-full ${isArabic ? "rtl" : "ltr"}`}>
      {/* Sidebar */}
      <LargeSidebar
        lang={i18n.language}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />

      {/* Main content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300`}
        style={{
          marginLeft: isArabic ? undefined : isExpanded ? "21rem" : "6.5rem", // يعكس حجم Sidebar الموسع
          marginRight: isArabic ? (isExpanded ? "20rem" : "5.5rem") : undefined,
        }}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 px-2 pt-2 shadow-sm">
          <LargeHeader isExpanded={isExpanded} />
        </div>

        {/* Page content */}
        <div className="">{children}</div>
      </div>
    </div>
  );
}
