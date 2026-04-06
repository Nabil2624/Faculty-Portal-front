import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home, User, BookOpenText, University, Goal, FolderKanban, 
  Briefcase, BookMarkedIcon, HelpingHand, Award,
  ShieldCheck, LifeBuoy, Headset // أضفت الأيقونات الناقصة للـ Roles التانية
} from "lucide-react";
import logo from "../assets/Capital.png";

export default function Sidebar({ lang, isExpanded, setIsExpanded }) {
  const { t } = useTranslation("headerandsidebar");
  const [openMenus, setOpenMenus] = useState({});
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isArabic = lang === "ar";

  // جلب الـ Role من الـ localStorage
  const userRole = localStorage.getItem("userRole");

  const toggleSidebar = () => setIsExpanded((prev) => !prev);

  const toggleMenu = (key, level = 1) => {
    setOpenMenus((prev) => ({
      ...prev,
      [level]: prev[level] === key ? null : key,
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isExpanded && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsExpanded(false);
        setOpenMenus({});
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  const iconClass = "w-[clamp(20px,1.6vw,60px)] h-[clamp(20px,1.6vw,60px)] shrink-0 transition-all duration-300";

  const navItems = [
    { key: "home", icon: <Home />, link: "/profile" },
    { key: "personalInfo", icon: <User />, link: "/personal-data" },
    {
      key: "researchAndSupervision",
      icon: <BookOpenText />,
      sub: [
        { key: "researches", link: "/ResearchesPage" },
        { key: "supervisionThesis", link: "/supervision-thesis" },
        { key: "theses", link: "/theses" },
        // { key: "researcherProfile", link: "/researcher-profile" },
        { key: "nominatedResearches", link: "/nominated-research" },
        // { key: "recommendedSupervisions", link: "/recommended-supervisions" },
      ],
    },
    {
      key: "scientificProgression",
      icon: <University />,
      sub: [
        { key: "academicQualifications", link: "/academic-qualifications" },
        { key: "jobGrades", link: "/job-rankings" },
        { key: "administrativePositions", link: "/administrative-positions" },
      ],
    },
    {
      key: "experiences",
      icon: <Briefcase />,
      sub: [
        { key: "general-experiences", link: "/general-experiences" },
        { key: "teaching-experiences", link: "/teaching-experiences" },
      ],
    },
    {
      key: "Publications&Patents",
      icon: <BookMarkedIcon />,
      sub: [
        { key: "patents", link: "/patents" },
        { key: "scientific-writing", link: "/scientific-writing" },
      ],
    },
    {
      key: "projectsAndCommittee",
      icon: <FolderKanban />,
      sub: [
        { key: "committeeAndAssociation", link: "/committee-associations" },
        { key: "articleReviews", link: "/article-reviews" },
        { key: "participationJournals", link: "/journals" },
        { key: "Projects", link: "/projects" },
      ],
    },
    {
      key: "missions",
      icon: <Goal />,
      sub: [
        { key: "scientificMissions", link: "/scientific-missions" },
        { key: "seminarsAndConferences", link: "/seminars-and-conferences" },
        { key: "trainingPrograms", link: "/training-programs" },
      ],
    },
    {
      key: "contributions",
      icon: <HelpingHand />,
      sub: [
        { key: "university-contribution", link: "/university-contribution" },
        { key: "Contributions-community-service", link: "/Contributions-community-service" },
        { key: "participation-in-quality-work", link: "/participation-in-quality-work" },
      ],
    },
    {
      key: "awards",
      icon: <Award />,
      sub: [
        { key: "prizesAndRewards", link: "/prizes-and-rewards" },
        { key: "manifiestation", link: "/manifestations-of-scientific-appreciation" },
      ],
    },
    // إضافة العناصر الخاصة بالـ Roles الأخرى بنفس ستايلك
    {
      key: "support",
      icon: <LifeBuoy />,
      link: "/tickets",
      roles: ["Faculty Member"],
    },
    {
      key: "supportAdminTickets",
      icon: <Headset />,
      link: "/support-admin",
      roles: ["SupportAdmin"],
    },
    {
      key: "adminPanel",
      icon: <ShieldCheck />,
      roles: ["ManagementAdmin"],
      sub: [
        { key: "systemLogs", link: "/logs" },
        { key: "logsCategories", link: "/logs-categories" },
        { key: "systemUsers", link: "/admin/users" },
        { key: "createUser", link: "/admin/create-user", roles: ["ManagementAdmin"] },
        { key: "managementTickets", link: "/admin/tickets", roles: ["ManagementAdmin"] },
      ],
    },
  ];

  const lineOffset = "clamp(15px,1vw,50px)";
  const lineWidth = "clamp(1px, 0.1vw,2px)";

  const renderMenu = (items, level = 1) =>
    items.map((item) => {
      // --- هنا منطق الفلترة للـ Sub Items ---
      if (item.roles && !item.roles.includes(userRole)) return null;

      const hasSub = item.sub && item.sub.length > 0;
      const isOpen = openMenus[level] === item.key;
      const isActive = location.pathname === item.link || (hasSub && item.sub.some(s => s.link === location.pathname));

      return (
        <li key={item.key} className="relative list-none group">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isExpanded) {
                setIsExpanded(true);
                if (hasSub) setOpenMenus({ [level]: item.key });
                if (item.link) navigate(item.link);
              } else {
                if (hasSub) toggleMenu(item.key, level);
                if (item.link) navigate(item.link);
              }
            }}
            className={`flex items-center gap-[clamp(0.5rem,0.6vw,1.2rem)] px-[clamp(0.2rem,0.4vw,1rem)] py-[clamp(0.2rem,0.3vw,0.6rem)] w-full rounded-md transition-all duration-300
              ${isActive ? "bg-white/5 text-[#B38e19]" : "hover:bg-white/5 text-white/70 hover:text-white"}`}
          >
            {React.cloneElement(item.icon, { 
              className: `${iconClass} ${isActive ? "text-[#B38e19]" : "text-white/40 group-hover:text-white"}` 
            })}
            {isExpanded && (
              <span className={`text-[clamp(0.75rem,1vw,9rem)] truncate ${isActive ? "font-semibold" : "font-medium"}`}>
                {t(item.key)}
              </span>
            )}
            {isActive && <div className={`absolute h-4 w-1 bg-[#B38e19] rounded-full ${isArabic ? "-right-1" : "-left-1"}`} />}
          </button>

          <div className={`grid transition-all duration-300 ease-in-out ${isOpen && isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 overflow-hidden"}`}>
            <ul className="overflow-hidden relative flex flex-col gap-0.5 mt-0.5">
              <div
                className="absolute bg-white/10"
                style={isArabic ? { right: lineOffset, top: "4px", bottom: "4px", width: lineWidth } 
                               : { left: lineOffset, top: "4px", bottom: "4px", width: lineWidth }}
              />
              {item.sub?.map((subItem) => {
                // --- فلترة العناصر الفرعية بناءً على الـ Role ---
                if (subItem.roles && !subItem.roles.includes(userRole)) return null;
                
                return (
                  <li key={subItem.key} className={`relative ${isArabic ? "mr-[clamp(1rem,1vw,4rem)]" : "ml-[clamp(1rem,1vw,4rem)]"}`}>
                    <Link to={subItem.link} onClick={(e) => e.stopPropagation()}
                      className={`block py-[clamp(0.1rem,0.15vw,0.4rem)] px-3 text-[clamp(0.75rem,0.9vw,8rem)] rounded-sm transition-all
                        ${location.pathname === subItem.link ? "text-[#B38e19] font-medium bg-white/5" : "text-white/40 hover:text-white hover:bg-white/5"}`}
                    >
                      {t(subItem.key)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </li>
      );
    });

  return (
    <aside
      ref={sidebarRef}
      className={`flex flex-col bg-[#19355a] text-white overflow-hidden shadow-2xl border-r border-white/5
        ${isExpanded ? "w-[clamp(14rem,14vw,30rem)]" : "w-[clamp(3rem,3.7vw,8rem)]"}
        fixed top-2 bottom-2 ${isArabic ? "right-2" : "left-2"} rounded-[clamp(1px,0.5vw,20px)] transition-all duration-300 ease-in-out z-[1000]`}
      style={{ height: "calc(100vh - 16px)" }}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className={`flex items-center gap-[clamp(0.5rem,0.5vw,1rem)] cursor-pointer p-4 pb-2 border-b border-white/5 mb-4
        ${isExpanded ? "justify-start" : "justify-center"}`}
        onClick={(e) => { e.stopPropagation(); toggleSidebar(); }}
      >
        <img src={logo} alt="Logo" className="w-[clamp(2rem,2.5vw,4rem)] h-auto object-contain" />
        {isExpanded && (
          <h2 className={`font-black text-[#B38e19] text-[clamp(1rem,1.2vw,2rem)] leading-none uppercase tracking-tighter`}>
            {t("capitalUniversity")}
          </h2>
        )}
      </div>

      {/* Menu List */}
      <ul className="flex flex-col flex-1 px-[clamp(0.25rem,0.6vw,0.7rem)] gap-1 overflow-y-auto no-scrollbar pb-10">
        {renderMenu(
          
          navItems.filter((item) => {
            if (item.roles) return item.roles.includes(userRole);
            if (userRole === "SupportAdmin") return false;
            return true;
          })
        )}
      </ul>
    </aside>
  );
}