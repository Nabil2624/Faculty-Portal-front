import React, { useState, useEffect, useRef } from "react";
import { Bell, Mail, Search, Menu, ChevronDown, LogOut, DoorOpen  } from "lucide-react"; // استخدم LogOut كأيقونة باب
import { useTranslation } from "react-i18next";
import FloatingSearch from "./FloatingSearch";
import egyptFlag from "../images/egyptFlag.png";
import ukFlag from "../images/americaFlag.png";


export default function MobileHeader({ onBurgerClick }) {
  const { t, i18n } = useTranslation("headerandsidebar");
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
    window.location.href = "/login";
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
    <header className="flex items-center justify-between w-full bg-[#19355a] text-white fixed top-0 z-10 p-2">

      {/* Left side (Burger + icons) */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBurgerClick}
          className="p-2 hover:bg-white/20 rounded-full"
        >
          <Menu size={20} />
        </button>

        <Bell size={18} className="cursor-pointer" />
        <Mail size={18} className="cursor-pointer" />
        <button
          onClick={() => setSearchOpen(true)}
          className="p-1 hover:bg-white/20 rounded-full transition"
        >
          <Search size={18} />
        </button>
      </div>

      {/* Right side (Language + Logout) */}
      <div className="flex items-center gap-2">
        {/* Language Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 px-1 py-1 hover:bg-white/20 rounded-md"
          >
            <img
              src={isArabic ? egyptFlag : ukFlag}
              alt={isArabic ? "Arabic" : "English"}
              className="w-5 h-4"
            />
            <ChevronDown size={14} />
          </button>

          {dropdownOpen && (
            <div
              className={`absolute mt-1 bg-[#19355a] text-white border rounded-md shadow-md z-[2000] text-sm ${
                isArabic ? "left-0" : "right-0"
              }`}
            >
              <button
                onClick={() => handleLanguageChange("ar")}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-[#19355a]"
              >
                <img src={egyptFlag} className="w-5 h-4" /> 
              </button>
              <button
                onClick={() => handleLanguageChange("en")}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-[#19355a]"
              >
                <img src={ukFlag} className="w-5 h-4" /> 
              </button>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-8 h-8 rounded-full  text-white"
          title={t("logout") || "Logout"}
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* Floating Search */}
      <FloatingSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
