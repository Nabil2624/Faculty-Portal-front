import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import MobileHeader from "./MobileHeader";
import MobileSidebar from "./MobileSidebar";

export default function LayoutMobile({ children }) {
  const { i18n } = useTranslation();
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const isArabic = i18n.language === "ar";

  const handleCloseSidebar = () => setSidebarMobileOpen(false);

  return (
    <div
      className={`flex flex-col h-screen w-full bg-white ${
        isArabic ? "rtl" : "ltr"
      }`}
    >
      {/* Sidebar Overlay */}
      <MobileSidebar
        isOpen={sidebarMobileOpen}
        onClose={handleCloseSidebar}
        lang={i18n.language}
      />

      {/* Header */}
      <MobileHeader onBurgerClick={() => setSidebarMobileOpen(true)} />

   
      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-white pt-[60px]">{children}</div>
    </div>
  );
}
