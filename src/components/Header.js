import React, { useState, useEffect, useRef } from "react";
import { Bell, Mail, Search, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import egyptFlag from "../images/egyptFlag.png";
import ukFlag from "../images/americaFlag.png";

import FloatingSearch from "./FloatingSearch";

export default function Header({ isExpanded }) {
  const { t, i18n } = useTranslation("headerandsidebar");
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [searchOpen, setSearchOpen] = useState(false);

  const isArabic = i18n.language === "ar";

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

  // Close language dropdown on outside click
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
      bg-[#19355a] px-4 py-2 text-white rounded-lg
      ${isArabic ? "mr-1" : "ml-1"}
      relative z-50
      sticky top-0
    `}
    >
      {/* Right side icons */}
      <div className="flex items-center gap-3">
        <Bell className="cursor-pointer" size={18} />
        <Mail className="cursor-pointer" size={18} />

        {/* Search icon */}
        <button
          onClick={() => setSearchOpen(true)}
          className="p-1 hover:bg-white/20 rounded-full transition"
        >
          <Search size={18} />
        </button>
      </div>

      {/* Left controls */}
      <div className="flex items-center gap-3">
        {/* Language dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center gap-2 px-3 py-1 rounded-md border text-sm 
              bg-[#19355a] text-white`}
          >
            {isArabic ? (
              <>
                <img src={egyptFlag} alt="Arabic" className="w-5 h-4" />
                <span>ع</span>
              </>
            ) : (
              <>
                <img src={ukFlag} alt="English" className="w-5 h-4" />
                <span>En</span>
              </>
            )}
            <ChevronDown size={14} />
          </button>

          {dropdownOpen && (
            <div
              className={`absolute mt-1 bg-[#19355a] text-white border rounded-md shadow-md z-[2000] text-sm 
              ${isArabic ? "left-0" : "right-0"}`}
            >
              <button
                onClick={() => handleLanguageChange("ar")}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-[#17314f]"
              >
                <img src={egyptFlag} className="w-5 h-4" /> العربية
              </button>

              <button
                onClick={() => handleLanguageChange("en")}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-[#17314f]"
              >
                <img src={ukFlag} className="w-5 h-4" /> English
              </button>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="font-semibold text-sm hover:underline"
        >
          {t("logout")}
        </button>
      </div>

      {/* Floating Search */}
      <FloatingSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
