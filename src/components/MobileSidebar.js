import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  X,
  Home,
  GraduationCap,
  Briefcase,
  CreditCard,
  FileText,
  BookOpen,
  Settings,
  Headphones,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "../images/helwan-logo.png";

export default function MobileSidebar({ isOpen, onClose, lang }) {
  const { t } = useTranslation("headerandsidebar");
  const sidebarRef = useRef(null);
  const [openMenus, setOpenMenus] = useState({});
  const isArabic = lang === "ar";

  const navItems = [
    { key: "home", icon: <Home size={22} />, link: "/under-development", sub: [] },
    {
      key: "academicData",
      icon: <GraduationCap size={22} />,
      sub: [
        {
          key: "personalInfo",
          sub: [
            { key: "personalData", link: "/personal" },
            { key: "contactInfo", link: "/contact-info" },
            { key: "socialNetworking", link: "/social-networking" },
            { key: "identificationCard", link: "/identification-card" },
          ],
        },
        {
          key: "scientificProgression",
          sub: [
            { key: "academicQualifications", link: "/academic-qualifications" },
            { key: "jobGrades", link: "/job-rankings" },
            { key: "administrativePositions", link: "/administrative-positions" },
          ],
        },
      ],
    },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const toggleMenu = (key, level) => {
    setOpenMenus((prev) => ({
      ...prev,
      [level]: prev[level] === key ? null : key,
    }));
  };

  const renderMenu = (items, level = 1) => {
    const offset = 16;

    return (
      <ul className="relative text-start">
        {items.map((item) => {
          const hasSub = item.sub && item.sub.length > 0;
          const isOpen = openMenus[level] === item.key;

          return (
            <li key={item.key} className="relative my-1">
              {/* كونتينر للـ level مع الخط العمودي */}
              <div className="relative">
                {level > 1 && (
                  <div
                    className="absolute top-0 bottom-0 w-px bg-gray-400"
                    style={isArabic ? { right: `${(level - 1) * offset}px` } : { left: `${(level - 1) * offset}px` }}
                  />
                )}

                {/* الزر */}
                <button
                  onClick={() => hasSub && toggleMenu(item.key, level)}
                  className="w-full py-1 text-gray-200 hover:text-white hover:bg-[#B38e19] rounded-md text-start flex items-center gap-2 relative z-10"
                  style={isArabic ? { paddingRight: `${level * offset}px` } : { paddingLeft: `${level * offset}px` }}
                >
                  {item.icon}
                  <span>{t(item.key)}</span>
                </button>

                {/* Submenu */}
                {hasSub && isOpen && (
                  <div style={{ marginTop: "2px", marginLeft: isArabic ? 0 : offset, marginRight: isArabic ? offset : 0 }}>
                    {renderMenu(item.sub, level + 1)}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" />
      <aside
        ref={sidebarRef}
        className="relative w-64 bg-[#19355a] text-white p-4 flex flex-col max-w-[80vw]"
        dir={isArabic ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 text-start">
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <h2 className="font-bold text-lg text-start">{t("helwanUniversity")}</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Main nav */}
        <nav className="flex flex-col gap-3 flex-1 overflow-auto text-start">
          {renderMenu(navItems)}
        </nav>

        {/* Footer nav */}
        <div className="flex flex-col gap-3 mt-4">
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#B38e19] transition"
          >
            <Settings size={22} />
            <span>{t("settings")}</span>
          </Link>
          <Link
            to="/support"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#B38e19] transition"
          >
            <Headphones size={22} />
            <span>{t("support")}</span>
          </Link>
        </div>
      </aside>
    </div>
  );
}
