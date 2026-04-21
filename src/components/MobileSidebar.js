import React, { useRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  X,
  Home,
  User,
  BookOpenText,
  University,
  Goal,
  FolderKanban,
  Briefcase,
  BookMarkedIcon,
  HelpingHand,
  Award,
  ShieldCheck,
  LifeBuoy,
  Headset,
  Settings,
  IdCard,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "../assets/helwan-logo.png";

export default function MobileSidebar({ isOpen, onClose, lang }) {
  const { t } = useTranslation("headerandsidebar");
  const sidebarRef = useRef(null);
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const isArabic = lang === "ar";
  const userRoles = JSON.parse(localStorage.getItem("userRoles") || "[]");

  // القائمة الكاملة من كود الـ PC
  const navItems = [
    { key: "home", icon: <Home size={20} />, link: "/profile" },
    { key: "personalInfo", icon: <User size={20} />, link: "/personal-data" },

    {
      key: "researchAndSupervision",
      icon: <BookOpenText size={20} />,
      sub: [
        { key: "researches", link: "/ResearchesPage" },
        { key: "supervisionThesis", link: "/supervision-thesis" },
        { key: "theses", link: "/theses" },
        { key: "researcherProfile", link: "/researcher-profile" },
        { key: "nominatedResearches", link: "/nominated-research" },
        { key: "recommendedSupervisions", link: "/recommended-supervisions" },
      ],
    },
    {
      key: "scientificProgression",
      icon: <University size={20} />,
      sub: [
        { key: "academicQualifications", link: "/academic-qualifications" },
        { key: "jobGrades", link: "/job-rankings" },
        { key: "administrativePositions", link: "/administrative-positions" },
      ],
    },
    {
      key: "experiences",
      icon: <Briefcase size={20} />,
      sub: [
        { key: "general-experiences", link: "/general-experiences" },
        { key: "teaching-experiences", link: "/teaching-experiences" },
      ],
    },
    {
      key: "Publications&Patents",
      icon: <BookMarkedIcon size={20} />,
      sub: [
        { key: "patents", link: "/patents" },
        { key: "scientific-writing", link: "/scientific-writing" },
      ],
    },
    {
      key: "projectsAndCommittee",
      icon: <FolderKanban size={20} />,
      sub: [
        { key: "committeeAndAssociation", link: "/committee-associations" },
        { key: "articleReviews", link: "/article-reviews" },
        { key: "participationJournals", link: "/journals" },
        { key: "Projects", link: "/projects" },
      ],
    },
    {
      key: "missions",
      icon: <Goal size={20} />,
      sub: [
        { key: "scientificMissions", link: "/scientific-missions" },
        { key: "seminarsAndConferences", link: "/seminars-and-conferences" },
        { key: "trainingPrograms", link: "/training-programs" },
      ],
    },
    {
      key: "contributions",
      icon: <HelpingHand size={20} />,
      sub: [
        { key: "university-contribution", link: "/university-contribution" },
        {
          key: "Contributions-community-service",
          link: "/Contributions-community-service",
        },
        {
          key: "participation-in-quality-work",
          link: "/participation-in-quality-work",
        },
      ],
    },
    {
      key: "awards",
      icon: <Award size={20} />,
      sub: [
        { key: "prizesAndRewards", link: "/prizes-and-rewards" },
        {
          key: "manifiestation",
          link: "/manifestations-of-scientific-appreciation",
        },
      ],
    },
    { key: "cv", icon: <IdCard />, link: "/cv" },
    {
      key: "support",
      icon: <LifeBuoy size={20} />,
      link: "/tickets",
      roles: ["Faculty Member"],
    },
    {
      key: "supportAdminTickets",
      icon: <Headset size={20} />,
      link: "/support-admin",
      roles: ["SupportAdmin"],
    },
    {
      key: "adminPanel",
      icon: <ShieldCheck size={20} />,
      roles: ["ManagementAdmin"],
      sub: [
        { key: "systemLogs", link: "/logs" },
        { key: "logsCategories", link: "/logs-categories" },
        { key: "systemUsers", link: "/admin/users" },
        {
          key: "createUser",
          link: "/admin/create-user",
          roles: ["ManagementAdmin"],
        },
        {
          key: "managementTickets",
          link: "/admin/tickets",
          roles: ["ManagementAdmin"],
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
    return (
      <div className="relative flex flex-col gap-1">
        {items.map((item) => {
          if (item.roles && !item.roles.some((r) => userRoles.includes(r)))
            return null;

          const hasSub = item.sub && item.sub.length > 0;
          const isOpenMenu = openMenus[level] === item.key;
          const isActive =
            location.pathname === item.link ||
            (hasSub && item.sub.some((s) => s.link === location.pathname));

          return (
            <div key={item.key} className="flex flex-col">
              <button
                onClick={() => (hasSub ? toggleMenu(item.key, level) : null)}
                className={`w-full py-2.5 px-3 rounded-lg flex items-center gap-3 transition-all duration-300 group
                  ${isActive ? "bg-white/10 text-[#B38e19]" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
              >
                <span
                  className={`${isActive ? "text-[#B38e19]" : "text-white/40 group-hover:text-white"}`}
                >
                  {item.icon}
                </span>
                <span
                  className={`text-sm ${isActive ? "font-bold" : "font-medium"}`}
                >
                  {t(item.key)}
                </span>
              </button>

              {hasSub && isOpenMenu && (
                <div
                  className={`relative mt-1 mb-2 ${isArabic ? "mr-6 border-r" : "ml-6 border-l"} border-white/10 flex flex-col gap-1`}
                >
                  {item.sub.map((subItem) => {
                    if (
                      subItem.roles &&
                      !subItem.roles.some((r) => userRoles.includes(r))
                    )
                      return null;
                    return (
                      <Link
                        key={subItem.key}
                        to={subItem.link}
                        onClick={onClose}
                        className={`py-2 px-4 text-xs transition-all rounded-md
                          ${location.pathname === subItem.link ? "text-[#B38e19] bg-white/5 font-bold" : "text-white/40 hover:text-white hover:bg-white/5"}`}
                      >
                        {t(subItem.key)}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <aside
        ref={sidebarRef}
        className={`relative w-72 bg-[#19355a] shadow-2xl flex flex-col h-full transition-transform duration-300 ease-in-out
          ${isArabic ? "rounded-l-2xl ml-auto" : "rounded-r-2xl mr-auto"} border-white/5`}
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/5 mb-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-9 h-9 object-contain" />
            <h2 className="font-black text-[#B38e19] text-sm leading-tight uppercase tracking-tighter">
              {t("capitalUniversity")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto no-scrollbar px-4 py-2">
          {renderMenu(
            navItems.filter((item) => {
              if (item.roles)
                return item.roles.some((r) => userRoles.includes(r));
              // Items without a roles restriction are Faculty Member items
              if (!userRoles.includes("Faculty Member")) return false;
              return true;
            }),
          )}
        </nav>

        <div className="p-4 bg-black/10 border-t border-white/5 flex flex-col gap-1">
          <Link
            to="/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/5 hover:text-white"
          >
            <Settings size={20} className="opacity-50" />
            <span className="text-sm font-medium">{t("settings")}</span>
          </Link>
        </div>
      </aside>
    </div>
  );
}
