import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
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
} from "lucide-react";
import logo from "../assets/Capital.png";

export default function Sidebar({ lang, isExpanded, setIsExpanded }) {
  const { t } = useTranslation("headerandsidebar");
  const [openMenus, setOpenMenus] = useState({});
  const sidebarRef = useRef(null);

  const isArabic = lang === "ar";

  const toggleSidebar = () => setIsExpanded((prev) => !prev);

  const toggleMenu = (key, level = 1) => {
    setOpenMenus((prev) => ({
      ...prev,
      [level]: prev[level] === key ? null : key,
    }));
  };

  /* يقفل لما تدوس بره */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isExpanded &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
        setOpenMenus({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  const iconClass =
    "w-[clamp(20px,1.6vw,60px)] h-[clamp(20px,1.6vw,60px)] shrink-0";

  const navItems = [
    { key: "home", icon: <Home />, link: "/under-development" },
    {
      key: "personalInfo",
      icon: <User />,
      sub: [
        { key: "personalData", link: "/personal" },
        { key: "contactInfo", link: "/contact-info" },
        { key: "socialNetworking", link: "/social-networking" },
        { key: "identificationCard", link: "/identification-card" },
      ],
    },
    {
      key: "researchAndSupervision",
      icon: <BookOpenText />,
      sub: [
        { key: "researches", link: "/scientific-researches" },
        { key: "supervisionThesis", link: "/supervision-thesis" },
        { key: "theses", link: "/theses" },
        { key: "researcherProfile", link: "/researcher-profile" },
        { key: "nominatedResearches", link: "/nominated-research" },
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
      icon: <Award />,
      sub: [
        { key: "prizesAndRewards", link: "/prizes-and-rewards" },
        {
          key: "manifiestation",
          link: "/manifestations-of-scientific-appreciation",
        },
      ],
    },
  ];

  const lineOffset = "clamp(15px,1vw,50px)";
  const lineWidth = "clamp(1px, 0.1vw,2px)";

  const renderMenu = (items, level = 1) =>
    items.map((item) => {
      const hasSub = item.sub && item.sub.length > 0;
      const isOpen = openMenus[level] === item.key;

      return (
        <li key={item.key} className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isExpanded) {
                setIsExpanded(true);
                if (hasSub) {
                  setOpenMenus((prev) => ({ ...prev, [level]: item.key }));
                }
              } else if (hasSub) toggleMenu(item.key, level);
            }}
            className={`flex items-center gap-[clamp(0.5rem,0.5vw,1rem)] px-[clamp(0.2rem,0.3vw,1rem)] py-[clamp(0.25rem,0.5vw,0.5rem)] w-full rounded-md hover:bg-[#B38e19] transition ${
              isExpanded ? "justify-start" : "justify-center"
            }`}
          >
            {React.cloneElement(item.icon, { className: iconClass })}
            {isExpanded && (
              <span className="text-[clamp(0.75rem,1vw,9rem)] font-medium">
                {t(item.key)}
              </span>
            )}
          </button>

          {hasSub && isOpen && isExpanded && (
            <ul className="relative mt-[clamp(0.25rem,0.5vw,0.5rem)]">
              <div
                className="absolute bg-gray-400"
                style={
                  isArabic
                    ? {
                        right: lineOffset,
                        top: "4px",
                        bottom: "4px",
                        width: lineWidth,
                      }
                    : {
                        left: lineOffset,
                        top: "4px",
                        bottom: "4px",
                        width: lineWidth,
                      }
                }
              />
              {item.sub.map((subItem) => (
                <li
                  key={subItem.key}
                  className={`relative mt-[clamp(2px,0.5vw,4px)] ${
                    isArabic
                      ? "mr-[clamp(1rem,1vw,4rem)]"
                      : "ml-[clamp(1rem,0.5vw,3rem)]"
                  }`}
                >
                  <Link
                    to={subItem.link}
                    onClick={(e) => e.stopPropagation()}
                    className="block py-[clamp(0rem,0.2vw,3rem)] px-[clamp(0.5rem,0.5vw,6rem)] text-gray-200 text-[clamp(0.75rem,0.9vw,8rem)] hover:text-white hover:bg-[#B38e19] rounded-md"
                  >
                    {t(subItem.key)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    });

  return (
    <aside
      ref={sidebarRef}
      onClick={() => {
        if (!isExpanded) setIsExpanded(true);
      }}
      className={`flex flex-col justify-between bg-[#19355a] text-white ${
        isExpanded
          ? "w-[clamp(14rem,14vw,30rem)]"
          : "w-[clamp(3rem,3.7vw,8rem)]"
      } fixed top-2 bottom-2 ${isArabic ? "right-2" : "left-2"} rounded-[clamp(1px,0.5vw,20px)] transition-all duration-300 ease-in-out`}
      style={{ height: "calc(100vh - 16px)" }}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div
        className={`flex items-center gap-[clamp(0.5rem,0.5vw,1rem)] cursor-pointer px-[clamp(0.5rem,0.5vw,1rem)] py-[clamp(0.25rem,1vw,0.5rem)] ${
          isExpanded ? "justify-start" : "justify-center"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          toggleSidebar();
        }}
      >
        <img
          src={logo}
          alt="Logo"
          className={`w-[clamp(2.5rem,2vw,7rem)] h-[clamp(3rem,4vw,8rem)] ${
            !isExpanded && "mx-auto"
          }`}
        />
        {isExpanded && (
          <h2
            className={`font-bold ${
              isArabic
                ? "text-[clamp(1rem,1.3vw,2rem)]"
                : "text-[clamp(1rem,1.3vw,2rem)]"
            }`}
          >
            {t("capitalUniversity")}
          </h2>
        )}
      </div>

      {/* Menu */}
      <ul className="flex flex-col flex-1 mt-6 gap-[clamp(0.25rem,0.5vw,0.5rem)]">
        {renderMenu(navItems)}
      </ul>
    </aside>
  );
}
