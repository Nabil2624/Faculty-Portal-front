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
import logo from "../assets/helwan-logo.png";

export default function LargeSidebar({ lang, isExpanded, setIsExpanded }) {
  const { t } = useTranslation("headerandsidebar");
  const [openMenu, setOpenMenu] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const toggleSidebar = () => setIsExpanded((prev) => !prev);
  const toggleMenu = (menu) => setOpenMenu(openMenu === menu ? null : menu);
  const toggleSubMenu = (submenu) =>
    setOpenSubMenu(openSubMenu === submenu ? null : submenu);

  const isArabic = lang === "ar";

  const navItems = [
    // نفس البيانات اللي عندك في Sidebar الأصلي
    {
      key: "home",
      icon: <Home size={26} />, // أكبر شوية
      link: "/under-development",
      sub: [],
    },
    {
      key: "academicData",
      icon: <GraduationCap size={26} />,
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
        // باقي القوائم كما هي...
      ],
    },
    // باقي العناصر...
  ];

  const renderSubMenu = (sub, level = 1) => (
    <ul className={`mt-2 ml-3 ${isArabic ? "mr-6" : "ml-6"}`}>
      {sub.map((item) => (
        <li
          key={item.key}
          className={`relative 
            before:content-[''] before:absolute before:top-0 before:bottom-0 before:w-px before:bg-gray-400
            ${isArabic ? "before:right-0 pr-4" : "before:left-0 pl-4"}`}
        >
          {item.sub ? (
            <>
              <button
                onClick={() => toggleSubMenu(item.key)}
                className={`block py-2 text-base text-gray-200 hover:text-white hover:bg-[#B38e19] rounded-md w-full
                  ${isArabic ? `text-right pr-${level * 5}` : `text-left pl-${level * 5}`}`}
              >
                {t(item.key)}
              </button>
              {openSubMenu === item.key && renderSubMenu(item.sub, level + 1)}
            </>
          ) : (
            <Link
              to={item.link}
              className={`block py-2 text-base text-gray-200 hover:text-white hover:bg-[#B38e19] rounded-md
                ${isArabic ? `text-right pr-${level * 5}` : `text-left pl-${level * 5}`}`}
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
    ${isExpanded ? "w-72 md:w-80 xl:w-96 3xl:w-[320px]" : "w-16  3xl:w-[85px]"} 
    fixed top-2 bottom-2 ${isArabic ? "right-2" : "left-2"} 
    rounded-3xl transition-all duration-300 ease-in-out z-50`} // z-50 ليكون فوق المحتوى
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Header / Logo */}
      <div
        className={`flex items-center gap-3 cursor-pointer px-3 py-3 ${
          isExpanded ? "justify-start" : "justify-center"
        }`}
        onClick={toggleSidebar}
      >
        <img
          src={logo}
          alt="Logo"
          className={`w-12 h-12 3xl:w-16 3xl:h-16 ${!isExpanded && "mx-auto"}`}
        />
        {isExpanded && (
          <h2 className="font-bold text-xl 3xl:text-2xl">
            {t("helwanUniversity")}
          </h2>
        )}
      </div>

      {/* Menu */}
      <ul className="flex flex-col flex-1 gap-3 mt-6">
        {navItems.map((item) => (
          <li key={item.key}>
            {item.sub.length === 0 ? (
              <Link
                to={item.link}
                className={`flex items-center gap-4 px-4 py-3 rounded-md hover:bg-[#B38e19] transition
                  ${isExpanded ? "justify-start" : "justify-center"}`}
              >
                {item.icon}
                {isExpanded && (
                  <span className="text-lg 3xl:text-xl">{t(item.key)}</span>
                )}
              </Link>
            ) : (
              <div>
                <button
                  onClick={() => toggleMenu(item.key)}
                  className={`flex items-center gap-4 px-4 py-3 w-full rounded-md hover:bg-[#B38e19] transition
                    ${isExpanded ? "justify-start" : "justify-center"}`}
                >
                  {item.icon}
                  {isExpanded && (
                    <span className="text-lg 3xl:text-xl">{t(item.key)}</span>
                  )}
                </button>

                {/* Submenu */}
                {openMenu === item.key && isExpanded && renderSubMenu(item.sub)}
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="flex flex-col gap-4 mt-auto mb-6">
        <Link
          to="/settings"
          className={`flex items-center gap-4 px-4 py-3 rounded-md hover:bg-[#B38e19] transition
            ${isExpanded ? "justify-start" : "justify-center"}`}
        >
          <Settings size={26} />
          {isExpanded && (
            <span className="text-lg 3xl:text-xl">{t("settings")}</span>
          )}
        </Link>
        <Link
          to="/support"
          className={`flex items-center gap-4 px-4 py-3 rounded-md hover:bg-[#B38e19] transition
            ${isExpanded ? "justify-start" : "justify-center"}`}
        >
          <Headphones size={26} />
          {isExpanded && (
            <span className="text-lg 3xl:text-xl">{t("support")}</span>
          )}
        </Link>
      </div>
    </aside>
  );
}
