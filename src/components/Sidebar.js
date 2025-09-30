import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Home,
  GraduationCap,
  Briefcase,
  CreditCard,
  FileText,
  BookOpen,
  Settings,
  Headphones,
} from "lucide-react";
import "../styles/Sidebar.css";
import logo from "../images/helwan-logo.png";

export default function Sidebar({ lang, isExpanded, setIsExpanded }) {
  const { t } = useTranslation("HeaderAndSideBar");

  // Dynamic icon size
   const iconSize = isExpanded ? 32 : 32;

  const toggleSidebar = () => setIsExpanded((prev) => !prev);

  return (
    <aside
      className={`sidebar ${isExpanded ? "expanded" : "collapsed"} ${
        lang === "ar" ? "sidebar-rtl sidebar-right" : "sidebar-ltr sidebar-left"
      }`}
    >
      {/* Header */}
      <div className="sidebar-header" onClick={toggleSidebar}>
        <img
          src={logo}
          alt="Helwan Logo"
          className={`sidebar-logo ${isExpanded ? "" : "collapsed-logo"}`}
        />
        {isExpanded && <h2 className="sidebar-title">{t("helwanUniversity")}</h2>}
      </div>

      {/* Menu */}
      <ul className="sidebar-menu">
        <li>
          <Link to="/">
            <Home size={iconSize} /> {isExpanded && t("home")}
          </Link>
        </li>
        <li>
          <Link to="/academic-data">
            <GraduationCap size={iconSize} /> {isExpanded && t("academicData")}
          </Link>
        </li>
        <li>
          <Link to="/study-exams">
            <Briefcase size={iconSize} /> {isExpanded && t("studyAndExams")}
          </Link>
        </li>
        <li>
          <Link to="/financial-dues">
            <CreditCard size={iconSize} /> {isExpanded && t("financialDues")}
          </Link>
        </li>
        <li>
          <Link to="/leaves-docs">
            <FileText size={iconSize} /> {isExpanded && t("leavesAndDocs")}
          </Link>
        </li>
        <li>
          <Link to="/trainings-courses">
            <BookOpen size={iconSize} /> {isExpanded && t("trainingsAndCourses")}
          </Link>
        </li>
      </ul>

      {/* Footer */}
      <div className="sidebar-footer">
        <div>
          <Settings size={iconSize} /> {isExpanded && t("settings")}
        </div>
        <div>
          <Headphones size={iconSize} /> {isExpanded && t("support")}
        </div>
      </div>
    </aside>
  );
}
