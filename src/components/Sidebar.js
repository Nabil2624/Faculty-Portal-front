import React, { useState } from "react";
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
import logo from "../images/helwan-logo.png";

export default function Sidebar({ lang, isExpanded, setIsExpanded }) {
  const { t } = useTranslation("HeaderAndSideBar");
  const [openMenu, setOpenMenu] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const toggleSidebar = () => setIsExpanded((prev) => !prev);
  const toggleMenu = (menu) => setOpenMenu(openMenu === menu ? null : menu);
  const toggleSubMenu = (submenu) =>
    setOpenSubMenu(openSubMenu === submenu ? null : submenu);

  const isArabic = lang === "ar";

  const navItems = [
    { key: "home", icon: <Home size={22} />, link: "/", sub: [] },
    {
      key: "academicData",
      icon: <GraduationCap size={22} />,
      sub: [
        {
          key: "personalInfo",
          link: "/academic-data/personal-data",
          sub: [
            { key: "personalData", link: "/personal" },
            { key: "contactInfo", link: "/contact-info" },
            { key: "socialNetworking", link: "/social-networking" },
            { key: "identificationCard", link: "/identification-card" },
          ],
        },
        // { key: "schedule", link: "/academic-data/schedule" },
      ],
    },
    {
      key: "studyAndExams",
      icon: <Briefcase size={22} />,
      sub: [
        // { key: "midterms", link: "/study-exams/midterms" },
        // { key: "finals", link: "/study-exams/finals" },
      ],
    },
    {
      key: "financialDues",
      icon: <CreditCard size={22} />,
      sub: [
        // { key: "tuition", link: "/financial-dues/tuition" },
        // { key: "payments", link: "/financial-dues/payments" },
      ],
    },
    {
      key: "leavesDocs",
      icon: <FileText size={22} />,
      sub: [
        { key: "leaveRequest", link: "/under-development" },
        // { key: "certificates", link: "/leaves-docs/certificates" },
      ],
    },
    {
      key: "trainingsCourses",
      icon: <BookOpen size={22} />,
      sub: [
        // { key: "onlineTraining", link: "/trainings-courses/online" },
        // { key: "onsiteTraining", link: "/trainings-courses/onsite" },
      ],
    },
  ];
  
  const renderSubMenu = (sub, level = 1) => (
    <ul className={`mt-1 ml-2 ${isArabic ? "mr-5" : "ml-5"}`}>
      {sub.map((item) => (
        <li
          key={item.key}
          className={`relative 
            before:content-[''] before:absolute before:top-0 before:bottom-0 before:w-px before:bg-gray-400
            ${isArabic ? "before:right-0 pr-3" : "before:left-0 pl-3"}`}
        >
          {item.sub ? (
            <>
              <button
                onClick={() => toggleSubMenu(item.key)}
                className={`block py-1 text-sm text-gray-200 hover:text-white hover:bg-[#B38e19] rounded-md w-full
                  ${isArabic ? `text-right pr-${level * 4}` : `text-left pl-${level * 4}`}`}
              >
                {t(item.key)}
              </button>
              {openSubMenu === item.key && renderSubMenu(item.sub, level + 1)}
            </>
          ) : (
            <Link
              to={item.link}
              className={`block py-1 text-sm text-gray-200 hover:text-white hover:bg-[#B38e19] rounded-md
                ${isArabic ? `text-right pr-${level * 4}` : `text-left pl-${level * 4}`}`}
            >
              {t(item.key)}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`flex flex-col justify-between bg-[#19355a] text-white 
        ${isExpanded ? "w-56" : "w-[51px]"} 
        fixed top-2 bottom-2 ${isArabic ? "right-2" : "left-2"} 
        rounded-xl transition-all duration-300 ease-in-out`}
      style={{ height: "calc(100vh - 16px)" }}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Header / Logo */}
      <div
        className={`flex items-center gap-2 cursor-pointer px-2 py-2 ${
          isExpanded ? "justify-start" : "justify-center"
        }`}
        onClick={toggleSidebar}
      >
        <img
          src={logo}
          alt="Logo"
          className={`w-10 h-10 ${!isExpanded && "mx-auto"}`}
        />
        {isExpanded && (
          <h2 className="font-bold text-lg">{t("helwanUniversity")}</h2>
        )}
      </div>

      {/* Menu */}
      <ul className="flex flex-col flex-1 gap-2 mt-6">
        {navItems.map((item) => (
          <li key={item.key}>
            {item.sub.length === 0 ? (
              <Link
                to={item.link}
                className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#B38e19] transition
                  ${isExpanded ? "justify-start" : "justify-center"}`}
              >
                {item.icon}
                {isExpanded && <span>{t(item.key)}</span>}
              </Link>
            ) : (
              <div>
                <button
                  onClick={() => toggleMenu(item.key)}
                  className={`flex items-center gap-3 px-3 py-2 w-full rounded-md hover:bg-[#B38e19] transition
                    ${isExpanded ? "justify-start" : "justify-center"}`}
                >
                  {item.icon}
                  {isExpanded && <span>{t(item.key)}</span>}
                </button>

                {/* Submenu */}
                {openMenu === item.key && isExpanded && renderSubMenu(item.sub)}
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="flex flex-col gap-3 mt-auto mb-4">
        <Link
          to="/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#B38e19] transition
            ${isExpanded ? "justify-start" : "justify-center"}`}
        >
          <Settings size={22} />
          {isExpanded && <span>{t("settings")}</span>}
        </Link>
        <Link
          to="/support"
          className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#B38e19] transition
            ${isExpanded ? "justify-start" : "justify-center"}`}
        >
          <Headphones size={22} />
          {isExpanded && <span>{t("support")}</span>}
        </Link>
      </div>
    </aside>
  );
}
