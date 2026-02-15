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
  User,
  BookOpenText,
  University,
  Goal,
  FileTextIcon,
  FolderKanban
} from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "../assets/helwan-logo.png";

export default function MobileSidebar({ isOpen, onClose, lang }) {
  const { t } = useTranslation("headerandsidebar");
  const sidebarRef = useRef(null);
  const [openMenus, setOpenMenus] = useState({});
  const isArabic = lang === "ar";

  // Nav items بعد تعديل الليفلات: كل ليفل 2 سابق أصبح ليفل 1، والمحتوى جوه أصبح ليفل 2
  const navItems = [
    {
      key: "home",
      icon: <Home size={22} />,
      link: "/under-development",
      sub: [],
    },
    {
      key: "personalInfo",
      icon: <User size={22} />,
      sub: [
        { key: "personalData", link: "/personal" },
        { key: "contactInfo", link: "/contact-info" },
        { key: "socialNetworking", link: "/social-networking" },
        { key: "identificationCard", link: "/identification-card" },
      ],
    },
    {
      key: "researchAndSupervision",
      icon: <BookOpenText size={22} />,
      sub: [
        { key: "researches", link: "/scientific-researches" },
        { key: "supervisionThesis", link: "/supervision-thesis" },
        { key: "myThesis", link: "/my-thesis" },
        { key: "researcherProfile", link: "/researcher-profile" },
        { key: "nominatedResearches", link: "/nominated-researches" },
      ],
    },
    {
      key: "scientificProgression",
      icon: <University size={22} />,
      sub: [
        { key: "academicQualifications", link: "/academic-qualifications" },
        { key: "jobGrades", link: "/job-rankings" },
        { key: "administrativePositions", link: "/administrative-positions" },
      ],
    },
    {
      key: "projectsAndCommittee",
      icon: <FolderKanban size={22} />,
      sub: [
        { key: "committeeAndAssociation", link: "/committee-associations" },
        { key: "articleReviews", link: "/article-reviews" },
        { key: "participationJournals", link: "/journals" },
        { key: "projects", link: "/projects" },
      ],
    },
    {
      key: "missions",
      icon: <Goal size={22} />,
      sub: [
        { key: "scientificMissions", link: "/scientific-missions" },
        { key: "seminarsAndConferences", link: "/seminars-and-conferences" },
        { key: "trainingPrograms", link: "/training-programs" },
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

  const lineOffsetByLevel = { 2: 15 };

  const toggleMenu = (key, level) => {
    setOpenMenus((prev) => ({
      ...prev,
      [level]: prev[level] === key ? null : key,
    }));
  };

  const renderMenu = (items, level = 1) => {
    const containerPadding = 8;

    return (
      <div
        className="relative"
        style={{
          paddingLeft: isArabic ? 0 : level > 1 ? level * containerPadding : 0,
          paddingRight: isArabic
            ? level > 1
              ? level * containerPadding
              : 0
            : 0,
        }}
      >
        {level > 1 && (
          <div
            className="absolute top-0 bottom-0 w-px bg-gray-400"
            style={
              isArabic
                ? { right: (lineOffsetByLevel[level] || 0) + "px" }
                : { left: (lineOffsetByLevel[level] || 0) + "px" }
            }
          />
        )}

        {items.map((item) => {
          const hasSub = item.sub && item.sub.length > 0;
          const isOpen = openMenus[level] === item.key;

          const buttonPaddingStyle = isArabic
            ? { paddingRight: containerPadding * (level - 1) + "px" }
            : { paddingLeft: containerPadding * (level - 1) + "px" };

          return (
            <div
              key={item.key}
              className="relative z-10"
              style={{
                marginTop: "4px",
                marginBottom: level === 1 ? "20px" : "2px",
              }}
            >
              <button
                onClick={() => hasSub && toggleMenu(item.key, level)}
                className="w-full py-1 text-gray-200 hover:text-white hover:bg-[#B38e19] rounded-md flex items-center gap-2 text-sm relative z-10"
                style={buttonPaddingStyle}
              >
                {item.icon}
                <span>{t(item.key)}</span>
              </button>

              {hasSub && isOpen && (
                <div className="mt-1">{renderMenu(item.sub, level + 1)}</div>
              )}
            </div>
          );
        })}
      </div>
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
        <div className="flex items-center justify-between mb-10 text-start">
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <h2 className="font-bold text-lg text-start">
            {t("helwanUniversity")}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main nav */}
        <nav className="flex flex-col gap-3 flex-1 overflow-auto text-start">
          {renderMenu(navItems)}
        </nav>

        {/* Footer */}
        <div className="flex flex-col gap-3 mt-4">
          <Link
            to="/settings"
            className="flex items-center gap-3 px-1 py-2 rounded-md hover:bg-[#B38e19] transition"
          >
            <Settings size={22} />
            <span>{t("settings")}</span>
          </Link>

          <Link
            to="/support"
            className="flex items-center gap-3 px-1 py-2 rounded-md hover:bg-[#B38e19] transition"
          >
            <Headphones size={22} />
            <span>{t("support")}</span>
          </Link>
        </div>
      </aside>
    </div>
  );
}
