import React, { useState, useEffect, useRef } from "react";
import { Bell, Mail, Search, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import egyptFlag from "../assets/egyptFlag.png";
import ukFlag from "../assets/americaFlag.png";

import FloatingSearch from "./FloatingSearch";

export default function Header({ isExpanded }) {
  const { t, i18n } = useTranslation("headerandsidebar");
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [searchOpen, setSearchOpen] = useState(false);

  const isArabic = i18n.language === "ar";

  /* ===============================
     Responsive sizes (Tablet → XL)
  =============================== */

  const iconClass =
    "w-[clamp(20px,1.6vw,60px)] h-[clamp(20px,1.6vw,60px)] shrink-0";

  /* =============================== */

  useEffect(() => {
    document.documentElement.dir = isArabic ? "rtl" : "ltr";

    if (isArabic) {
      document.documentElement.classList.add("arabic-font");
      document.documentElement.classList.remove("english-font");
    } else {
      document.documentElement.classList.add("english-font");
      document.documentElement.classList.remove("arabic-font");
    }
  }, [i18n.language]);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      className={`flex items-center justify-between
        w-[calc(100%-0.5rem)]
        h-[clamp(48px,3.2vw,130px)]
        px-[clamp(16px,2vw,50px)]
        bg-[#19355a]
        text-white rounded-[clamp(1px,0.5vw,20px)]
        ${isArabic ? "mr-1" : "ml-1"}
        relative z-50 top-0
      `}
    >
      {/* Right side icons */}
      <div className="flex items-center gap-[clamp(8px,1vw,16px)]">
        <Bell className={iconClass} />
        <Mail className={iconClass} />

        <button
          onClick={() => setSearchOpen(true)}
          className="p-[clamp(4px,0.6vw,8px)] hover:bg-white/20 rounded-full transition"
        >
          <Search className={iconClass} />
        </button>
      </div>

      {/* Left controls */}
      <div className="flex items-center gap-[clamp(8px,1vw,16px)]">
        {/* Language dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-[clamp(13px,1vw,20px)] bg-[#19355a] text-white text-[clamp(13px,0.9vw,15px)]"
          >
            {isArabic ? (
              <>
                <img src={egyptFlag} alt="Arabic" className="w-[clamp(8px,2vw,80px)] h-[clamp(8px,1.5vw,50px)]" />
                <span className="text-[clamp(13px,1.2vw,45px)]">ع</span>
              </>
            ) : (
              <>
                <img src={ukFlag} alt="English" className="w-[clamp(8px,2vw,50px)] h-[clamp(8px,2vw,50px)]" />
                <span>En</span>
              </>
            )}

            <ChevronDown className="w-[clamp(12px,1.5vw,50px)] h-[clamp(12px,1.5vw,50px)]" />
          </button>

          {dropdownOpen && (
            <div
              className={`absolute mt-1 bg-[#19355a] text-white shadow-md z-[2000] text-sm
              ${isArabic ? "left-0" : "right-0"}`}
            >
              <button
                onClick={() => handleLanguageChange("ar")}
                className="flex items-center gap-[clamp(13px,1vw,20px)] w-full px-3 py-2 hover:bg-[#17314f]"
              >
                <img src={egyptFlag} className="w-5 h-4" alt="" />
                العربية
              </button>

              <button
                onClick={() => handleLanguageChange("en")}
                className="flex items-center gap-[clamp(13px,1vw,20px)] w-full px-3 py-2 hover:bg-[#17314f]"
              >
                <img src={ukFlag} className="w-5 h-4" alt="" />
                English
              </button>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="font-semibold hover:underline text-[clamp(13px,1.2vw,45px)]"
        >
          {t("logout")}
        </button>
      </div>

      {/* Floating Search */}
      <FloatingSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </header>
  );
}
