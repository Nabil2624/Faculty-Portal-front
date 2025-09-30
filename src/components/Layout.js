import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "../styles/Layout.css";

export default function Layout({ children }) {
  const { i18n } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  return (
    <div className={`layout ${i18n.language === "ar" ? "rtl" : "ltr"}`}>
      <Sidebar
        lang={i18n.language}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />
      <div className={`main-content ${isExpanded ? "shifted" : "collapsed"}`}>
        <Header onLanguageChange={handleLanguageChange} />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}
